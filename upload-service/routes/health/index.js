'use strict';

const db_client = require('@lib/clients/db')

module.exports = async function (fastify, opts) {
    fastify.get('/', async function (request, response) {
        await db_client.select(db_client.raw("1 + 1"))
        return response.send({ message: "Healthy" })
    })
}