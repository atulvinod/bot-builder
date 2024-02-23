"use client";

import { useEffect, useRef, useState } from "react";
import * as schema from "../../../schemas/schemas";
import { ChatInput } from "./chat_input";
import ChatBubble from "./message_bubble";
import { toast } from "sonner";
import { ChatMessage } from "@/app/shared/utils";
import { animateScroll } from "react-scroll";

export default function ChatPanel({
    bot_details,
    chat_history,
}: {
    bot_details: typeof schema.botDetails.$inferSelect;
    chat_history: ChatMessage[];
}) {
    const [history, setChatHistory] = useState(chat_history);
    const [enableInput, setInputEnabled] = useState(true);
    const [responseStream, setResponseStream] = useState<string | null>(null);

    const contentRef = useRef<HTMLDivElement | null>(null);

    function scrollToBottom() {
        animateScroll.scrollToBottom({
            containerId: "messages",
            animateScroll: true,
        });
    }
    useEffect(() => {
        scrollToBottom();
    }, [history, responseStream]);

    async function getAnswer(question: string) {
        setInputEnabled(false);
        const new_history = [...history];
        new_history.push({
            role: "user",
            content: question,
        });
        setChatHistory(new_history);
        const decoder = new TextDecoder("utf-8");

        const response = await fetch(
            `http://${process.env.NEXT_PUBLIC_CHAT_SERVICE_API}/bot/chat/${bot_details.id}/ask`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    question,
                }),
            }
        );
        if (!response.ok) {
            toast.error("Something went wrong, please try again");
            return;
        }

        if (response.body && typeof response.body.getReader == "function") {
            const reader = response.body.getReader();
            let responseStreamData = "";
            const read = () => {
                reader.read().then(({ done, value }) => {
                    if (done) {
                        new_history.push({
                            role: "assistant",
                            content: responseStreamData,
                        });
                        setInputEnabled(true);
                        setResponseStream(null);
                        setChatHistory(new_history);
                        return;
                    }
                    let textChunk = decoder.decode(value);
                    responseStreamData += textChunk;
                    setResponseStream(responseStreamData);
                    read();
                });
            };
            read();
        }
    }

    return (
        <div className="w-full h-full flex flex-col py-20">
            <div
                className="flex-auto  flex flex-col justify-between mb-4"
                id="messages"
            >
                {history.map((h, i) => {
                    return (
                        <ChatBubble role={h.role} key={i}>
                            <span>{h.content}</span>
                        </ChatBubble>
                    );
                })}
                {responseStream && (
                    <ChatBubble role={"assistant"}>
                        <span>{responseStream}</span>
                    </ChatBubble>
                )}
            </div>

            <ChatInput
                isInputEnabled={enableInput}
                onSubmit={(question) => getAnswer(question)}
            />
        </div>
    );
}
