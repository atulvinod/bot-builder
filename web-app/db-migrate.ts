import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { loadEnv } from "@/app/shared/utils";

loadEnv();

const db_config = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || "5432"),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
};
const migrationClient = postgres(db_config);

async function applyMigration() {
    try {
        await migrate(drizzle(migrationClient), {
            migrationsFolder: "./drizzle",
        });
        console.log("Migration applied successfully!");
    } catch (error) {
        console.error("Error applying migration:", error);
    } finally {
        await migrationClient.end();
    }
}

applyMigration();
