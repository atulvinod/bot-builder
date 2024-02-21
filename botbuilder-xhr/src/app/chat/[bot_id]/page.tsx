"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import * as schema from "../../../schemas/schemas";
import { Loader2 } from "lucide-react";
import { ChatInput } from "./chat_input";
import ChatBubble from "./message_bubble";
import ChatPanel from "./chat_panel";

export default function ChatPage({ params }: { params: { bot_id: string } }) {
    async function getBotDetails() {
        const request = await fetch(`/api/bot?bot_id=${params.bot_id}`);
        return request.json();
    }

    const { data, isLoading } = useQuery<typeof schema.botDetails.$inferSelect>(
        {
            queryKey: ["chat-bot-details"],
            queryFn: () => getBotDetails(),
        }
    );

    return (
        <div className="h-full w-full px-96">
            {isLoading && <Loader />}
            {!isLoading && data && <ChatPanel bot_details={data} />}
        </div>
    );
}

function Loader() {
    return (
        <div className="flex items-center justify-center h-full w-full  ">
            <Loader2 className="h-20 w-20 animate-spin" />
        </div>
    );
}
