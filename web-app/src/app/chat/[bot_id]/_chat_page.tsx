"use client";

import { useEffect, useState } from "react";
import { animateScroll } from "react-scroll";
import ChatBubble from "./components/message_bubble";
import { toast } from "sonner";
import { ChatInput } from "./components/chat_input";
import { ChatMessage } from "@/app/shared/utils";
import * as schemas from "../../../schemas/schemas";

import { ChatPageNav } from "./components/chat_page_navbar";
import Loader from "@/app/shared/components/loader";
import { useSession } from "next-auth/react";
import {
    clearChatRequest,
    getAnswerRequest,
    getChatHistory,
    getUserSession,
} from "./components/_services";

export default function ChatPage({
    bot_details,
    suggested_questions,
    created_by_user,
}: {
    bot_details: typeof schemas.botDetails.$inferSelect;
    suggested_questions: string[];
    created_by_user: typeof schemas.user.$inferSelect;
}) {
    const session = useSession();

    const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
    const [history, setChatHistory] = useState<ChatMessage[]>([]);
    const [currentSessionId, setSessionId] = useState<string | null>(null);
    const [isChatReady, setChatReady] = useState(false);
    const [currentJWT, setJWT] = useState<string | undefined>(undefined);

    const [enableInput, setInputEnabled] = useState(true);
    const [responseStream, setResponseStream] = useState<string | null>(null);

    useEffect(() => {
        async function run() {
            if (session.status == "authenticated") {
                const token = `Bearer ${session.data.jwt}`;
                const _user_session_id = await getUserSession(
                    bot_details.id,
                    token
                );
                const _history = await getChatHistory(
                    bot_details.id,
                    token,
                    _user_session_id
                );

                setSessionId(_user_session_id);
                setChatHistory(_history);
                setJWT(token);
                setAuthenticated(true);
                setChatReady(true);
            }
        }
        run();
        return () => {
            setSessionId(null);
            setChatHistory([]);
            setJWT(undefined);
            setAuthenticated(false);
            setChatReady(false);
        };
    }, [session, bot_details.id]);

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

        const response = await getAnswerRequest(
            bot_details.id,
            currentJWT!!,
            currentSessionId!!,
            question
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

    async function clearChat() {
        setChatReady(true);
        try {
            const sessionId = await clearChatRequest(
                bot_details.id,
                currentJWT!!,
                currentSessionId!!
            );
            setSessionId(sessionId);
            setChatHistory([]);
        } catch (ex) {
            toast.error("Unable to reset chat history, please try again later");
        } finally {
            setChatReady(false);
        }
    }

    return (
        <div className="h-[100vh]">
            <div className="h-full flex flex-col ">
                <div className="overflow-y-scroll mb-5 flex-auto" id="messages">
                    <ChatPageNav
                        is_authenticated={isAuthenticated}
                        bot_details={bot_details}
                        created_by_user_details={created_by_user}
                        on_clear_chat={clearChat}
                    />
                    {!isChatReady ? (
                        <Loader />
                    ) : (
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
                                    <ChatBubble
                                        role={"assistant"}
                                        animate={true}
                                    >
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
                    )}
                </div>
                <div className="px-96 lg:px-56 pb-20">
                    <ChatInput
                        isInputEnabled={isChatReady && enableInput}
                        onSubmit={(question) => getAnswer(question)}
                    />
                </div>
            </div>
        </div>
    );
}
