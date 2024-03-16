const { createClient } = require("redis");

let client = null;

async function getRedisClient() {
    if (client) {
        return client;
    }
    client = await createClient({
        url: process.env.REDIS_URL,
    }).connect();
    return client;
}


module.exports = {
    getRedisClient
}