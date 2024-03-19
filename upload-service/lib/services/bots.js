const db_client = require("@lib/clients/db");
const constants = require("@lib/constants");
const uuid = require("uuid");
const storage = require("@lib/clients/storage");
const ai = require("@lib/clients/openai");
const { getRedisClient } = require("@lib/clients/redis");
const { getDownloadURL } = require("firebase/storage");
const { bytesToMB } = require("@lib/utils");

/**
 *
 * @param {string} assets_id
 * @param {FormData} form_data
 * @param {*} training_schema
 */
async function handleFilesTrainingData(assets_id, form_data, training_schema) {
    const uploadRefs = [];

    for (let i = 0; i < training_schema.length; i++) {
        const tds = training_schema[i];
        let files = form_data[tds.files_id];
        files = !Array.isArray(files) ? [files] : files;
        let fileZipUploadRef = await storage.uploadZipped(
            `training/${assets_id}`,
            tds.files_id,
            files
        );

        training_schema[i].files = files.reduce((agg, f) => {
            agg.push({
                name: f.filename,
                size: bytesToMB(f._buf.length).toFixed(2),
            });
            return agg;
        }, []);

        uploadRefs.push(fileZipUploadRef.ref);
    }
    return uploadRefs;
}

/**
 *
 * @param {string} assets_id
 * @param {*} training_data
 * @param {string} bot_description
 * @param {FormData} form_data
 */
async function generateBotSpec({
    assets_id,
    training_data,
    bot_description,
    form_data,
}) {
    const spec = {
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
                    td.config
                );
                uploadRefs.push(...refs);
                break;
        }
    }

    const systemPrompt = await ai.generateBotSystemPrompt(bot_description);
    spec["system_prompt"] = systemPrompt;
    return [spec, uploadRefs];
}

async function createBotDetails({
    transaction,
    name,
    description,
    created_by_user_id,
    is_private,
    spec,
    assets_id,
    avatar,
}) {
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
    const value = {
        name,
        description,
        created_by_user_id,
        spec,
        assets_id,
        avatar_image,
        is_private,
    };
    const [{ id }] = await transaction
        .table("bot_details")
        .insert(value)
        .returning("id");
    return [id, uploadRefs];
}

/**
 *
 * @param {number} bot_id
 */
async function pushToTaskQueue(bot_id) {
    try {
        const redis_client = await getRedisClient();
        6;
        const payload = JSON.stringify({ bot_id });
        console.log(payload);
        await redis_client.lPush("task", payload);
    } catch (e) {
        await db_client("bot_details")
            .update({ status: "failed_queue_push" })
            .where({ id: bot_id });
    }
}

async function createBot({
    user_id,
    bot_name,
    bot_description,
    is_private,
    training_data,
    form_data,
    avatar,
}) {
    const assets_id = uuid.v4();
    let botDataUploadRefs = [];
    const tx = await db_client.transaction();

    try {
        const [spec, specUploadRefs] = await generateBotSpec({
            assets_id,
            training_data,
            bot_description,
            form_data,
        });
        botDataUploadRefs.push(...specUploadRefs);
        const [botId, detailUploadRefs] = await createBotDetails({
            transaction: tx,
            name: bot_name,
            description: bot_description,
            created_by_user_id: user_id,
            is_private: is_private ?? false,
            spec,
            assets_id,
            avatar,
        });
        botDataUploadRefs.push(...detailUploadRefs);
        console.log("Pushing to queue");
        await tx.commit();
        await pushToTaskQueue(botId);
        console.log(`Created bot with id: `, botId);

        return botId;
    } catch (e) {
        tx.rollback();
        await storage.deleteRefs(botDataUploadRefs);
        throw e;
    }
}

module.exports = {
    createBot,
    pushToTaskQueue,
};
