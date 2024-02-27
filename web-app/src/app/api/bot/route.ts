import { NextRequest, NextResponse } from "next/server";
import * as constants from "@/lib/constants";
import * as botServices from "@/lib/services/bots";
import { StatusCodes } from "http-status-codes";
import { NextApiRequest } from "next";
import { botDetails } from "@/schemas/schemas";

const createTrainingDataMap = (formData: FormData) => {
    const obj: { [key: string]: any } = {};
    const trainingDataTypes = JSON.parse(
        formData.get(constants.TRAINING_DATA_TYPES)?.toString() ?? "[]"
    );
    (trainingDataTypes as []).forEach((t) => {
        obj[t] = formData.getAll(constants.inputTypeToFormKeyMap[t]);
    });
    return obj;
};

export async function POST(request: NextRequest) {
    const formData = await request.formData();

    const botName = formData.get(constants.BOT_NAME);
    const botDescription = formData.get(constants.BOT_DESCRIPTION);
    const trainingDataMap = createTrainingDataMap(formData);
    const avatarFile = formData.get(constants.BOT_AVATAR);
    if (botName && botDescription) {
        const botId = await botServices.createBot(
            1,
            botName.toString(),
            botDescription.toString(),
            trainingDataMap,
            avatarFile as File
        );
        if (botId) {
            return NextResponse.json(
                { message: "Created", data: { bot_id: botId } },
                { status: StatusCodes.CREATED }
            );
        } else {
            return NextResponse.json(
                {
                    message: "Unexpected error occurred",
                },
                { status: StatusCodes.INTERNAL_SERVER_ERROR }
            );
        }
    }
    return NextResponse.json(
        { error: "Missing required fields" },
        { status: StatusCodes.BAD_REQUEST }
    );
}

export async function GET(request: NextRequest) {
    const botId = request.nextUrl.searchParams.get("bot_id");
    const details = await botServices.getBotDetails(Number(botId));
    return NextResponse.json({ data: { details } });
}