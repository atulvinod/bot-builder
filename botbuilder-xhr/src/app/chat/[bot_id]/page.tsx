import { db_client } from "@/lib/db";
import * as schema from "../../../schemas/schemas";
import { eq } from "drizzle-orm";
import { ChatMessage } from "@/app/shared/utils";
import ChatPage from "./chat_page";

export default async function ChatPageRoot({
    params,
}: {
    params: { bot_id: number };
}) {
    const [botDetails] = await db_client
        .select()
        .from(schema.botDetails)
        .where(eq(schema.botDetails.id, params.bot_id));

    const chatHistoryRequest = await fetch(
        `http://${process.env.NEXT_PUBLIC_CHAT_SERVICE_API}/bot/${params.bot_id}/history`,
        { cache: "no-store" }
    );

    let chatHistory: ChatMessage[] = [];
    if (chatHistoryRequest.ok) {
        const requestBody = await chatHistoryRequest.json();
        chatHistory = requestBody.data.history;
    }

    return (
        <div className="flex flex-col">
            <ChatPage botDetails={botDetails} chatHistory={chatHistory} />
        </div>
    );
}
