"use strict";
const constants = require("@lib/constants");
const botService = require("@lib/services/bots");

const routeOptions = {
    headers: {
        type: "object",
        required: ["content-type"],
        properties: {
            "content-type": { type: "string", const: "multipart/form-data" },
        },
    },
};

module.exports = async function (fastify, opts) {
    fastify.post("/", routeOptions, async function (request, response) {
        const botName = request.body[constants.BOT_NAME].value;
        const botDescription = request.body[constants.BOT_DESCRIPTION].value;
        const trainingData = JSON.parse(
            request.body[constants.TRAINING_SPEC].value
        );
        const avatarFile = request.body[constants.BOT_AVATAR];
        const isPrivate = request.body[constants.IS_PRIVATE].value;
        try {
            const botId = await botService.createBot({
                user_id: request.user.id,
                bot_name: botName,
                bot_description: botDescription,
                is_private: isPrivate,
                training_data: trainingData,
                form_data: request.body,
                avatar: avatarFile,
            });
            return response
                .code(201)
                .send({ message: "Created", data: { bot_id: botId } });
        } catch (e) {
            request.log.error(e);
            return response.code(500).send({ message: "Error " + e?.message });
        }
    });
};
