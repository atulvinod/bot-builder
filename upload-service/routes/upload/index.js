'use strict'
const constants = require('@lib/constants');
const botService = require('@lib/services/bots');

const routeOptions = {
    headers: {
        type: 'object',
        required: ['content-type'],
        properties: {
            'content-type': { type: "string", const: 'multipart/form-data' }
        }
    }
}

module.exports = async function (fastify, opts) {
    fastify.post('/', routeOptions, async function (request, response) {
        const botName = request.body[constants.BOT_NAME].value
        const botDescription = request.body[constants.BOT_DESCRIPTION].value;
        const trainingData = JSON.parse(request.body[constants.TRAINING_SPEC].value);
        const avatarFile = request.body[constants.BOT_AVATAR]?.file;
        try {
            const botId = await botService.createBot(
                request.user.id,
                botName,
                botDescription,
                trainingData,
                request.body,
                avatarFile
            );
            return response.code(201).send({ message: "Created", data: { bot_id: botId } })
        } catch (e) {
            request.log.error(e)
            return response.code(500).send({ "message": "Error " + e?.message })
        }
    })
}