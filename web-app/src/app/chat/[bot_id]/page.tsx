"use client";

import ChatPage from "./_chat_page";
import * as schema from "../../../schemas/schemas";
import { SessionProvider } from "next-auth/react";

export default function ChatPageRoot({
    bot_details,
    created_by_user,
    suggested_questions,
}: {
    bot_details: typeof schema.botDetails.$inferSelect;
    created_by_user: typeof schema.user.$inferSelect;
    suggested_questions: string[];
}) {
    
    return (
        <SessionProvider>
            <ChatPage
                bot_details={bot_details}
                suggested_questions={suggested_questions}
                created_by_user={created_by_user}
            />
        </SessionProvider>
    );
}
