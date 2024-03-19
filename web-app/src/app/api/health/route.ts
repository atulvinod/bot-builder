import { db_client } from "@/lib/db";
import getRedisClient from "@/lib/redis";
import { sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const response = await db_client.execute(sql`select 1+1`);
        (await getRedisClient()).ping();
        if (response) {
            return NextResponse.json({ message: "Healthy" });
        } else {
            return NextResponse.error();
        }
    } catch (error) {
        return NextResponse.error();
    }
}
