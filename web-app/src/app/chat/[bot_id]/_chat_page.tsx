"use client";

import { useEffect, useRef, useState } from "react";
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

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import AvatarImage from "@/app/shared/components/avatar_image";
import GoogleButton from "react-google-button";
import { signIn } from "next-auth/react";
import Markdown from "react-markdown";

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
    const [isAuthenticated, setAuthenticated] = useState<boolean>(true);
    const [history, setChatHistory] = useState<ChatMessage[]>([]);
    const [currentSessionId, setSessionId] = useState<string | null>(null);
    const [isChatReady, setChatReady] = useState(false);
    const [currentJWT, setJWT] = useState<string | undefined>(undefined);

    const [enableInput, setInputEnabled] = useState(true);
    const [responseStream, setResponseStream] = useState<string | null>(null);
    const [responseErrored, setIsResponseErrored] = useState<boolean>(false);
    const lastQuestionAsked = useRef<string | null>(null);

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
            } else if (session.status == "loading" && !currentSessionId) {
                setChatReady(false);
                setAuthenticated(true);
            } else if (session.status == "unauthenticated") {
                setChatReady(false);
                setAuthenticated(false);
            }
        }
        run();
        return () => {
            setSessionId(null);
            setChatHistory([]);
            setJWT(undefined);
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
        lastQuestionAsked.current = question;
        setInputEnabled(false);
        setIsResponseErrored(false);

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
            new_history.pop();
            setChatHistory([...new_history]);
            setIsResponseErrored(true);
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
                         * Don't animate the fade in when re-rendering history, consider error if the response was only white test
                         */
                        if (responseStreamData.trim().length) {
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
                            setChatHistory(new_history);
                        } else {
                            toast.error(
                                "Something went wrong, please try again"
                            );
                            new_history.pop();
                            setChatHistory([...new_history]);
                            setIsResponseErrored(true);
                            setInputEnabled(true);
                        }
                        setInputEnabled(true);
                        setResponseStream(null);
                        return;
                    }
                    let textChunk = decoder.decode(value);
                    responseStreamData += textChunk;
                    if (responseStreamData.trim().length) {
                        setResponseStream(responseStreamData);
                    }
                    read();
                });
            };
            read();
        }
    }

    async function clearChat() {
        setChatReady(false);
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
            setChatReady(true);
        }
    }

    return (
        <>
            <div className="h-[100vh]">
                <div className="h-full flex flex-col ">
                    <div
                        className="overflow-y-scroll mb-5 flex-auto"
                        id="messages"
                    >
                        <ChatPageNav
                            is_authenticated={isAuthenticated}
                            bot_details={bot_details}
                            created_by_user_details={created_by_user}
                            on_clear_chat={clearChat}
                            current_user={
                                isAuthenticated && isChatReady
                                    ? session.data?.user
                                    : null
                            }
                        />
                        {!isChatReady ? (
                            <Loader />
                        ) : (
                            <div className="w-full h-full flex flex-col px-96 lg:px-56 pb-5 pt-24">
                                <div
                                    className="flex-auto  flex flex-col mb-4"
                                    id="messages"
                                >
                                    {isAuthenticated && (
                                        <ChatBubble role="assistant">
                                            <div>
                                                <p className="text-2xl">
                                                    Hello{" "}
                                                    {session.data?.user?.name} !
                                                </p>
                                                <p className="mt-1">
                                                    I am {bot_details.name},{" "}
                                                    {bot_details.description}
                                                </p>
                                            </div>
                                        </ChatBubble>
                                    )}
                                    {history.map((h, i) => {
                                        return (
                                            <ChatBubble
                                                role={h.role}
                                                key={i}
                                                animate={h.animate ?? false}
                                            >
                                                <Markdown>{h.content}</Markdown>
                                            </ChatBubble>
                                        );
                                    })}
                                    {responseErrored && (
                                        <ChatBubble
                                            role="user"
                                            isError={true}
                                            onClick={() =>
                                                getAnswer(
                                                    lastQuestionAsked.current!!
                                                )
                                            }
                                        >
                                            <Markdown>
                                                {lastQuestionAsked.current}
                                            </Markdown>
                                        </ChatBubble>
                                    )}
                                    {responseStream &&
                                        responseStream.trim().length && (
                                            <ChatBubble
                                                role={"assistant"}
                                                animate={true}
                                            >
                                                <Markdown>{responseStream}</Markdown>
                                            </ChatBubble>
                                        )}
                                </div>
                                {!history.length && (
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
                                                <Markdown>{q}</Markdown>
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
            <Dialog open={!isAuthenticated}>
                <DialogContent className="sm:max-w-[425px] h-" hideClose={true}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl text-center">
                            Sign-In
                        </DialogTitle>
                        <DialogDescription className="mt-5 text-black text-md text-center">
                            To use this bot, you need to sign-in.
                        </DialogDescription>
                        <div className="flex flex-col items-center py-5">
                            <AvatarImage
                                path={bot_details.avatar_image}
                                heightWidthClasses="h-24 w-24"
                            />
                            <span className="mt-3 text-xl">
                                {bot_details.name}
                            </span>
                            <GoogleButton
                                className="mt-5"
                                onClick={() => {
                                    signIn("google");
                                }}
                            />
                        </div>
                    </DialogHeader>
                    <div></div>
                </DialogContent>
            </Dialog>
        </>
    );
}
