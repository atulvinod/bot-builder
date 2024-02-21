import { db_client } from "../db";
import * as schemas from "../../schemas/schemas";
import * as constants from "../constants";
import { v4 as uuidv4 } from "uuid";
import * as storage from "../storage";
import * as ai from "../openai";
import getRedisClient from "../redis";
import { eq } from "drizzle-orm";
import { AppError } from "@/app/shared/app_error";
import { StatusCodes } from "http-status-codes";

async function generateBotSpec(
    training_data: { [key: string]: Object },
    bot_description: string
) {
    const uid = uuidv4();
    const spec: { [key: string]: any } = {
        data_id: uid,
        training_spec: [...Object.keys(training_data)],
        system_prompt: "",
    };

    if (constants.TrainingAssetTypes.Files in training_data) {
        await storage.uploadFiles(
            uid,
            "files",
            training_data[constants.TrainingAssetTypes.Files] as File[]
        );
    }
    // TODO: uncomment
    // const system_prompt = await ai.generateBotSystemPrompt(bot_description);
    spec["system_prompt"] = "systemPrompt";
    return spec;
}

async function createBotDetails(
    name: string,
    description: string,
    created_by_user_id: number,
    spec: Object
) {
    const value: typeof schemas.botDetails.$inferInsert = {
        name,
        description,
        created_by_user_id,
        spec,
    };
    const [inserted_value] = await db_client
        .insert(schemas.botDetails)
        .values(value)
        .returning();
    return inserted_value.id;
}

async function pushToTaskQueue(bot_id: number, data_id: string) {
    const redis_client = await getRedisClient();
    await redis_client.lPush("task", JSON.stringify({ bot_id, data_id }));
}

export async function createBot(
    user_id: number,
    bot_name: string,
    bot_description: string,
    training_data: { [key: string]: Object }
) {
    const spec = await generateBotSpec(training_data, bot_description);
    const botId = await createBotDetails(
        bot_name,
        bot_description,
        user_id,
        spec
    );
    await pushToTaskQueue(botId, spec.bot_id);
    return botId;
}

export async function getBotDetails(bot_id: number) {
    const [details] = await db_client
        .select()
        .from(schemas.botDetails)
        .where(eq(schemas.botDetails.id, bot_id));
    if (!details){
        throw new AppError(StatusCodes.NOT_FOUND, "Bot details not found")
    }

    return details
}
