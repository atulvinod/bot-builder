"use client";
import {
    Button,
    ButtonSize,
    ButtonVariants,
} from "@/app/shared/components/buttons";
import { useRef, useState } from "react";
import { PulseLoader } from "react-spinners";
import "animate.css";
import { SendHorizontal } from "lucide-react";

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
        if (!inputValue || inputValue.trim().length == 0) {
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
            <div
                className={
                    "min-h-16 bg-appGrey rounded-lg py-2 flex-auto h-full px-5 flex flex-row items-center"
                }
            >
                {!isInputEnabled && (
                    <PulseLoader
                        color="rgb(168 175 184)"
                        className="animate__animated animate__fadeInRight"
                    />
                )}
                {isInputEnabled && (
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
                        className="w-full bg-transparent outline-none resize-none animate__animated animate__fadeInDown"
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
                )}
            </div>
            <div className="ml-3 flex flex-col justify-center animate__animated animate__fadeIn">
                {isInputEnabled && (
                    <Button
                        size={ButtonSize.Large}
                        icon={<SendHorizontal />}
                        variant={ButtonVariants.Muted}
                        onClick={handleSubmit}
                    />
                )}
            </div>
        </div>
    );
}
