import { AppError, appErrorsStatus } from "@/app/shared/app_error";
import { getChatServiceHost } from "@/app/shared/utils";
import { StatusCodes } from "http-status-codes";
import { ChatMessage } from "@/app/shared/utils";

const CHAT_SESSION_HEADER_NAME = "Chat-Session-Id";

export async function clearChatRequest(
    bot_id: number,
    token: string,
    session_id: string
) {
    const newSessionRequest = await fetch(
        `/api/chat/bot/${bot_id}/session/reset`,
        {
            headers: {
                Authorization: token,
                [CHAT_SESSION_HEADER_NAME]: session_id,
            },
        }
    );
    if (!newSessionRequest.ok) {
        throw new Error("Failed to get new chat session");
    }
    const sessionRequestBody = await newSessionRequest.json();
    return sessionRequestBody.data.session;
}

export async function getAnswerRequest(
    bot_id: number,
    token: string,
    session_id: string,
    question: string
) {
    const response = await fetch(`/api/chat/bot/chat/${bot_id}/ask`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
            [CHAT_SESSION_HEADER_NAME]: session_id,
            Authorization: token,
        },
        body: JSON.stringify({
            question,
        }),
    });
    return response;
}

export async function getUserSession(
    bot_id: number,
    token: string
): Promise<string> {
    const userSessionRequest = await fetch(`/api/chat/bot/${bot_id}/session`, {
        headers: {
            Authorization: token,
        },
    });
    if (!userSessionRequest.ok) {
        throw new AppError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Failed to get user session",
            appErrorsStatus.USER_SESSION_FAILED
        );
    }

    const body = await userSessionRequest.json();
    return body.data.session;
}

export async function getChatHistory(
    bot_id: number,
    token: string,
    session_id: string
): Promise<ChatMessage[]> {
    const chatHistoryRequest = await fetch(`/api/chat/bot/${bot_id}/history`, {
        cache: "no-store",
        headers: {
            [CHAT_SESSION_HEADER_NAME]: session_id,
            Authorization: token,
        },
    });
    if (!chatHistoryRequest.ok) {
        throw new AppError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Failed to get chat history",
            appErrorsStatus.CHAT_HISTORY_FETCH_FAILED
        );
    }
    const body = await chatHistoryRequest.json();
    return body.data.history;
}
