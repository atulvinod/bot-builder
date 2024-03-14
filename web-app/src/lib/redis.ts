import { createClient } from "redis";

let client: ReturnType<typeof createClient> | null = null;

export default async function getRedisClient() {
    if (client) {
        return client;
    }
    client = await createClient({
        url: process.env.REDIS_URL,
    }).connect();
    return client;
}
