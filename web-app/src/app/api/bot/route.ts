import { NextRequest, NextResponse } from "next/server";
import * as botServices from "@/lib/services/bots";

export async function GET(request: NextRequest) {
    const botId = request.nextUrl.searchParams.get("bot_id");
    const details = await botServices.getBotDetails(Number(botId));
    return NextResponse.json({ data: { details } });
}
