import { NextRequest, NextResponse } from "next/server";
import * as botServices from "@/lib/services/bots";
import { StatusCodes } from "http-status-codes";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const botId = body.bot_id;
    try {
        await botServices.pushToTaskQueue(botId);
    } catch (e) {
        return NextResponse.json(
            { message: e?.message ?? JSON.stringify(e) },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
        );
    }
    return NextResponse.json({
        message: "Pushed to task queue: bot_id: " + botId,
    });
}
