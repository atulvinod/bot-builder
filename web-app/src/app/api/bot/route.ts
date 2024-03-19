import { NextRequest, NextResponse } from "next/server";
import * as botServices from "@/lib/services/bots";
import { AppError } from "@/app/shared/app_error";

export async function GET(request: NextRequest) {
    const botId = request.nextUrl.searchParams.get("bot_id");
    try {
        const details = await botServices.getBotDetails(Number(botId));
        return NextResponse.json({ data: { details } });
    } catch (error) {
        if (error instanceof AppError) {
            return NextResponse.json(
                { message: "error" },
                { status: error.appErrorCode || error.statusCode }
            );
        }
    }
}
