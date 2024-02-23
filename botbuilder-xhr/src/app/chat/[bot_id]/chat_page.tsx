"use client";

import AvatarImage from "@/app/shared/components/avatar_image";
import { Button, ButtonVariants } from "@/app/shared/components/buttons";
import infoIcon from "../../../svgs/info.svg";
import moreIcon from "../../../svgs/more.svg";
import Image from "next/image";
import ChatPanel from "./chat_panel";

export default function ChatPage({
    botDetails,
    chatHistory,
}: {
    botDetails: any;
    chatHistory: any;
}) {
    return (
        <div className="flex flex-col">
            <nav className="h-20 w-full border-b border-slate-200 border-solid flex items-center justify-between px-5">
                <div className="flex flex-row items-center">
                    <AvatarImage />
                    <span className="ml-2 text-xl">{botDetails.name}</span>
                </div>
                <div className="flex flex-row items-center">
                    <div>
                        <Button
                            buttonText={"Clear Chat"}
                            variant={ButtonVariants.Muted}
                        />
                    </div>

                    <div className="ml-2">
                        <Button
                            variant={ButtonVariants.Muted}
                            icon={
                                <Image
                                    alt="info-icon"
                                    src={infoIcon}
                                    width={20}
                                    height={20}
                                />
                            }
                        />
                    </div>
                    <div className="ml-2">
                        <Button
                            variant={ButtonVariants.Muted}
                            icon={
                                <Image
                                    alt="more-icon"
                                    src={moreIcon}
                                    width={20}
                                    height={20}
                                />
                            }
                        />
                    </div>
                </div>
            </nav>
            <div className="h-full">
                <div className="h-full w-full px-96">
                    <ChatPanel
                        chat_history={chatHistory}
                        bot_details={botDetails}
                    />
                </div>
            </div>
        </div>
    );
}
