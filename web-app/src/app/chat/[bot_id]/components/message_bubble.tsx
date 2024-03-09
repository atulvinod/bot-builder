import Image from "next/image";
import magicIcon from "../../../../svgs/sparkling.svg";
import "animate.css";
import clsx from "clsx";
import { RefreshCcw } from "lucide-react";

export default function ChatBubble({
    role: type,
    isMagic = false,
    children,
    onClick = () => {},
    animate = false,
    isError = false,
}: {
    role: "user" | "assistant";
    isMagic?: boolean;
    isError?: boolean;
    children: React.ReactElement;
    onClick?: () => void;
    animate?: boolean;
}) {
    return (
        <div
            className={clsx(
                "flex flex-row items-center mt-5",
                animate && "animate__animated animate__fadeInUp",
                type == "user" ? "justify-end" : "justify-start"
            )}
        >
            <div
                onClick={onClick}
                className={clsx(
                    `max-w-[55%] flex flex-row items-center`,
                    isMagic &&
                        "transition-transform duration-300 transform hover:translate-y-[-5px]"
                )}
            >
                {isMagic && (
                    <Image
                        src={magicIcon}
                        alt="magic_icon"
                        height={20}
                        width={20}
                        className="mr-3"
                    />
                )}
                {isError && type == "user" && (
                    <RefreshCcw
                        className="mr-3 cursor-pointer"
                        onClick={onClick}
                    />
                )}
                <div
                    className={clsx(
                        "rounded-3xl  px-5 py-3 w-fit",
                        type == "user" ? "rounded-br-none " : "rounded-bl-none",
                        isMagic && "bg-appLightBlue ",
                        !isMagic && type == "user"
                            ? "bg-appParrot"
                            : "bg-appTeal",
                        isError && type == "user" && "bg-red-500",
                        (isError || isMagic) && "cursor-pointer"
                    )}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
