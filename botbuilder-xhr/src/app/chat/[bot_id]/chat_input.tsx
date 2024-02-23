"use client";
import {
    Button,
    ButtonSize,
    ButtonVariants,
} from "@/app/shared/components/buttons";
import { useRef, useState } from "react";
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
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

    function handleSubmit() {
        if (inputValue && inputValue.length == 0) {
            return;
        }
        onSubmit(inputValue);
        setInputValue("");
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "24px";
        }
    }

    return (
        <div className="flex flex-row">
            <div className="min-h-16 bg-appGrey rounded-lg py-2 flex-auto h-full px-5 flex flex-row items-center">
                <textarea
                    ref={textAreaRef}
                    rows={1}
                    onKeyDown={(event) => {
                        if (event.key == "Enter") {
                            handleSubmit();
                        }
                    }}
                    disabled={!isInputEnabled}
                    value={inputValue}
                    className="w-full bg-transparent outline-none resize-none"
                    placeholder="Ask a question?"
                    onChange={(event) => {
                        const textarea = event.target;

                        // Reset the height to 1px to get the scroll height
                        textarea.style.height = "1px";

                        // Set the new height based on the scroll height
                        textarea.style.height = `${textarea.scrollHeight}px`;
                        setInputValue(event.target.value);
                    }}
                />
            </div>
            <div className="ml-3 flex flex-col justify-center">
                <Button
                    size={ButtonSize.Large}
                    icon={
                        <Image
                            src={sendIcon}
                            width={18}
                            height={18}
                            alt="send"
                        />
                    }
                    variant={ButtonVariants.Muted}
                    onClick={handleSubmit}
                />
            </div>
        </div>
    );
}
