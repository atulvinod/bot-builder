import { loadEnv } from "@/app/shared/utils";
import type { Config } from "drizzle-kit";

loadEnv();

export default {
    schema: ["./src/schemas/schemas.ts"],
    out: "./drizzle",
    driver: "pg", // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
    dbCredentials: {
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || "bot_builder",
    },
} satisfies Config;
