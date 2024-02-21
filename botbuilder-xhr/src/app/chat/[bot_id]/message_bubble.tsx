import Image from "next/image";
import magicIcon from "../../../svgs/sparkling.svg";

export default function ChatBubble({
    type,
    isMagic = false,
    children,
}: {
    type: "user" | "bot";
    isMagic: boolean;
    children: React.ReactElement;
}) {
    return (
        <div
            className={`flex flex-row items-center ${
                type == "user" ? "justify-end" : "justify-start"
            }`}
        >
            <div></div>
            <Image
                src={magicIcon}
                alt="magic_icon"
                height={20}
                width={20}
                className="mr-3"
            />
            <div
                className={`rounded-3xl mt-2 ${
                    type == "user" ? "rounded-br-none " : "rounded-bl-none "
                } ${isMagic ? "bg-appLightBlue" : ""} px-5 py-3 w-fit`}
            >
                {children}
            </div>
        </div>
    );
}
