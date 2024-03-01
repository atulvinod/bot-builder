import { db_client } from "@/lib/db";
import * as schema from "../../../schemas/schemas";
import { eq } from "drizzle-orm";
import { ChatMessage, getChatServiceHost } from "@/app/shared/utils";
import ChatPage from "./chat_page";
import { getServerSession } from "next-auth";

const CHAT_SERVICE_HOST = getChatServiceHost();

export default async function ChatPageRoot({
    params,
}: {
    params: { bot_id: number };
}) {
    const [{ bot_details: botDetails, users }] = await db_client
        .select()
        .from(schema.botDetails)
        .innerJoin(
            schema.user,
            eq(schema.botDetails.created_by_user_id, schema.user.id)
        )
        .where(eq(schema.botDetails.id, params.bot_id))
        .limit(1);

    let chatHistory: ChatMessage[] = [];
    let userSessionId: string | null = null;
    let suggestedQuestions: string[] = [];
    const session = await getServerSession();
    const authToken = `Bearer ${session?.user?.jwt}`;
    const userSessionRequest = await fetch(
        `${CHAT_SERVICE_HOST}/bot/${params.bot_id}/session`,
        {
            headers: {
                Authorization: authToken,
            },
        }
    );

    if (userSessionRequest.ok) {
        userSessionId = (await userSessionRequest.json()).data.session;
        const chatHistoryRequest = await fetch(
            `${CHAT_SERVICE_HOST}/bot/${params.bot_id}/history`,
            {
                cache: "no-store",
                headers: {
                    "Chat-Session-Id": userSessionId!!,
                    Authorization: authToken,
                },
            }
        );

        if (chatHistoryRequest.ok) {
            const requestBody = await chatHistoryRequest.json();
            chatHistory = requestBody.data.history;

            if (chatHistory.length == 0) {
                const suggestedQuestionsRequest = await fetch(
                    `${CHAT_SERVICE_HOST}/bot/${params.bot_id}/suggested_questions`,
                    {
                        cache: "no-store",
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );
                const suggestedQuestionsBody = (
                    await suggestedQuestionsRequest.json()
                ).data.questions;
                suggestedQuestions = suggestedQuestionsBody;
            }
        } else {
            throw new Error("Unexpected error occurred, Please try again");
        }
    } else {
        throw new Error("Unexpected error, Please try again");
    }

    return (
        <ChatPage
            bot_details={botDetails}
            chat_history={chatHistory}
            session_id={userSessionId!!}
            suggested_questions={suggestedQuestions}
            auth_token={authToken}
            created_by_user={users}
        />
    );
}
