import { db_client } from "../db";
import * as schemas from "../../schemas/schemas";
import * as constants from "../constants";
import { v4 as uuidv4 } from "uuid";
import * as storage from "../storage";
import * as ai from "../openai";
import getRedisClient from "../redis";
import { ExtractTablesWithRelations, eq } from "drizzle-orm";
import { AppError } from "@/app/shared/app_error";
import { StatusCodes } from "http-status-codes";
import {
    StorageReference,
    UploadResult,
    getDownloadURL,
} from "firebase/storage";
import { PgTransaction } from "drizzle-orm/pg-core";
import { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import {
    TrainingData,
    TrainingFilesConfig,
} from "@/app/shared/components/interfaces";
import { bytesToMB } from "@/app/shared/utils";

async function handleFilesTrainingData(
    assets_id: string,
    form_data: FormData,
    training_schema: TrainingFilesConfig[]
) {
    const uploadRefs: StorageReference[] = [];

    for (let i = 0; i < training_schema.length; i++) {
        const tds = training_schema[i];
        const files = form_data.getAll(tds.files_id);

        let fileZipUploadRef = await storage.uploadZipped(
            `training/${assets_id}`,
            tds.files_id,
            files as File[]
        );
        
        training_schema[i].files = (files as File[]).reduce(
            (agg: { name: string; size: string }[], f) => {
                agg.push({
                    name: f.name,
                    size: bytesToMB(f.size).toFixed(2),
                });
                return agg;
            },
            []
        );

        uploadRefs.push(fileZipUploadRef.ref);
    }
    return uploadRefs;
}

async function generateBotSpec(
    assets_id: string,
    training_data: TrainingData[],
    bot_description: string,
    form_data: FormData
): Promise<[{ [key: string]: any }, StorageReference[]]> {
    const spec: { [key: string]: any } = {
        training_spec: training_data,
        system_prompt: "",
    };

    const uploadRefs = [];
    for (let i = 0; i < training_data.length; i++) {
        const td = training_data[i];

        switch (td.type) {
            case constants.TrainingAssetTypes.Files:
                const refs = await handleFilesTrainingData(
                    assets_id,
                    form_data,
                    td.config as TrainingFilesConfig[]
                );
                uploadRefs.push(...refs);
                break;
        }
    }

    const systemPrompt = await ai.generateBotSystemPrompt(bot_description);
    spec["system_prompt"] = systemPrompt;
    return [spec, uploadRefs];
}

async function createBotDetails(
    transaction: PgTransaction<
        PostgresJsQueryResultHKT,
        Record<string, never>,
        ExtractTablesWithRelations<Record<string, never>>
    >,
    name: string,
    description: string,
    created_by_user_id: number,
    spec: Object,
    assets_id: string,
    avatar?: File
): Promise<[number, StorageReference[]]> {
    let avatar_image = null;
    let uploadRefs = [];
    if (avatar) {
        const uploadResult = await storage.uploadFile(
            `avatar/${assets_id}`,
            "avatar.png",
            avatar
        );
        avatar_image = await getDownloadURL(uploadResult.ref);
        uploadRefs.push(uploadResult.ref);
    }
    const value: typeof schemas.botDetails.$inferInsert = {
        name,
        description,
        created_by_user_id,
        spec,
        assets_id,
        avatar_image,
    };
    const [inserted_value] = await transaction
        .insert(schemas.botDetails)
        .values(value)
        .returning();
    return [inserted_value.id, uploadRefs];
}

export async function pushToTaskQueue(bot_id: number) {
    try {
        const redis_client = await getRedisClient();
        const payload = JSON.stringify({ bot_id });
        console.log(payload);
        await redis_client.lPush("task", payload);
    } catch (e) {
        await db_client
            .update(schemas.botDetails)
            .set({ status: "failed_queue_push" })
            .where(eq(schemas.botDetails.id, bot_id));
    }
}

export async function createBot(
    user_id: number,
    bot_name: string,
    bot_description: string,
    training_data: TrainingData[],
    form_data: FormData,
    avatar?: File
) {
    const assets_id = uuidv4();
    let botDataUploadRefs: StorageReference[] = [];
    const botId: number | null = await db_client.transaction(async (tx) => {
        try {
            const [spec, specUploadRefs] = await generateBotSpec(
                assets_id,
                training_data,
                bot_description,
                form_data
            );
            botDataUploadRefs.push(...specUploadRefs);
            const [botId, detailUploadRefs] = await createBotDetails(
                tx,
                bot_name,
                bot_description,
                user_id,
                spec,
                assets_id,
                avatar
            );
            botDataUploadRefs.push(...detailUploadRefs);
            return botId;
        } catch (e) {
            tx.rollback();
            await storage.deleteRefs(botDataUploadRefs);
            return null;
        }
    });
    if (botId) {
        await pushToTaskQueue(botId);
    }
    return botId;
}

export async function getBotDetails(bot_id: number) {
    const [details] = await db_client
        .select()
        .from(schemas.botDetails)
        .where(eq(schemas.botDetails.id, bot_id));
    if (!details) {
        throw new AppError(StatusCodes.NOT_FOUND, "Bot details not found");
    }

    return details;
}
