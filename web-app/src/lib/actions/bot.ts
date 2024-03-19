"use server";
import { eq } from "drizzle-orm";
import * as schema from "../../schemas/schemas";
import { db_client } from "../db";

export async function deleteBot(bot_id: number) {
    await db_client.delete(schema.botDetails).where(eq(schema.botDetails.id, bot_id))
}
