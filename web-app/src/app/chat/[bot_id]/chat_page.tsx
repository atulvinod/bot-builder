"use client";

import { useEffect, useState } from "react";
import { animateScroll } from "react-scroll";
import ChatBubble from "./message_bubble";
import { toast } from "sonner";
import { ChatInput } from "./chat_input";
import { ChatMessage, getChatServiceHost } from "@/app/shared/utils";
import * as schemas from "../../../schemas/schemas";

import { ChatPageNav } from "./chat_page_navbar";

const CHAT_SERVICE_HOST = getChatServiceHost();

export default function ChatPage({
    bot_details,
    chat_history,
    session_id,
    suggested_questions,
    auth_token,
    created_by_user,
}: {
    bot_details: typeof schemas.botDetails.$inferSelect;
    chat_history: (ChatMessage & { animate?: boolean })[];
    session_id: string;
    suggested_questions: string[];
    auth_token: string;
    created_by_user:typeof schemas.user.$inferSelect;
}) {
    const [history, setChatHistory] = useState(chat_history);
    const [enableInput, setInputEnabled] = useState(true);
    const [responseStream, setResponseStream] = useState<string | null>(null);

    useEffect(() => {
        scrollToBottom();
    }, [history, responseStream]);

    function scrollToBottom() {
        animateScroll.scrollToBottom({
            containerId: "messages",
            animateScroll: true,
        });
    }

    async function getAnswer(question: string) {
        setInputEnabled(false);
        let new_history = [...history];
        /**
         * Animate the fade in when the user has added the new message
         */
        new_history.push({
            role: "user",
            content: question,
            animate: true,
        });
        setChatHistory(new_history);
        const decoder = new TextDecoder("utf-8");

        const response = await fetch(
            `${CHAT_SERVICE_HOST}/bot/chat/${bot_details.id}/ask`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "text/event-stream",
                    "Chat-Session-Id": session_id,
                    Authorization: auth_token,
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
                        /**
                         * Don't animate the fade in when re-rendering history
                         */
                        new_history = [
                            ...new_history.map((h) => ({
                                ...h,
                                animate: false,
                            })),
                            {
                                role: "assistant",
                                content: responseStreamData,
                            },
                        ];
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
        <div className="flex flex-col h-[100vh]">
            <div className="overflow-y-scroll mb-5 flex-auto" id="messages">
                <ChatPageNav bot_details={bot_details} created_by_user_details={created_by_user} />
                <div className="w-full h-full flex flex-col px-96 lg:px-56 pb-5 pt-24">
                    <div
                        className="flex-auto  flex flex-col mb-4"
                        id="messages"
                    >
                        {history.map((h, i) => {
                            return (
                                <ChatBubble
                                    role={h.role}
                                    key={i}
                                    animate={h.animate ?? false}
                                >
                                    <span>{h.content}</span>
                                </ChatBubble>
                            );
                        })}
                        {responseStream && (
                            <ChatBubble role={"assistant"} animate={true}>
                                <span>{responseStream}</span>
                            </ChatBubble>
                        )}
                    </div>
                    {history.length == 0 && (
                        <div>
                            {suggested_questions.map((q, i) => (
                                <ChatBubble
                                    role={"user"}
                                    isMagic={true}
                                    key={i}
                                    animate={true}
                                    onClick={() => {
                                        getAnswer(q);
                                    }}
                                >
                                    <span>{q}</span>
                                </ChatBubble>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="px-96 lg:px-56 pb-20">
                <ChatInput
                    isInputEnabled={enableInput}
                    onSubmit={(question) => getAnswer(question)}
                />
            </div>
        </div>
    );
}
