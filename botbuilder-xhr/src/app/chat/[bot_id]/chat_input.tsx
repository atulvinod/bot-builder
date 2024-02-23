"use client";
import {
    Button,
    ButtonSize,
    ButtonVariants,
} from "@/app/shared/components/buttons";
import { useState } from "react";
import sendIcon from "../../../svgs/send.svg";
import Image from "next/image";

export function ChatInput({
    onSubmit,
    isInputEnabled,
}: {
    onSubmit: (ques: string) => void;
    isInputEnabled: boolean;
}) {
    const [inputValue, setInputValue] = useState("");

    return (
        <div className="flex flex-row">
            <div className="h-16 bg-appGrey rounded-full flex-auto">
                <div className="h-full px-10">
                    <input
                        disabled={!isInputEnabled}
                        value={inputValue}
                        type="text"
                        className="h-full w-full bg-transparent outline-none"
                        placeholder="Ask a question?"
                        onChange={(event) => {
                            setInputValue(event.target.value);
                        }}
                    />
                </div>
            </div>
            <div className="ml-3">
                <Button
                    icon={
                        <Image
                            src={sendIcon}
                            width={18}
                            height={18}
                            alt="send"
                        />
                    }
                    variant={ButtonVariants.Muted}
                    size={ButtonSize.MaxHeight}
                    onClick={() => {
                        onSubmit(inputValue);
                        setInputValue("");
                    }}
                />
            </div>
        </div>
    );
}
