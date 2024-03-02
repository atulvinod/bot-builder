import { drizzle } from "drizzle-orm/postgres-js";
import { Client } from "pg";

import postgres from "postgres";

const client = postgres({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || "5432"),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

let _client = drizzle(client);

export const db_client = _client;
