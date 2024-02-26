import { createClient } from "redis";

let client: ReturnType<typeof createClient> | null = null;

export default async function getRedisClient() {
    if (client) {
        return client;
    }
    client = await createClient({
        username: process.env.REDIS_USER,
        password: process.env.REDIS_PASSWORD,
        socket: {
            host: process.env.REDIS_HOST || "localhost",
            port: Number(process.env.REDIS_PORT || "6379"),
        },
    }).connect();
    return client;
}
