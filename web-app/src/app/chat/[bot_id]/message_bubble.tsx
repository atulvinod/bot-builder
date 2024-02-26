import Image from "next/image";
import magicIcon from "../../../svgs/sparkling.svg";

export default function ChatBubble({
    role: type,
    isMagic = false,
    children,
}: {
    role: "user" | "assistant";
    isMagic?: boolean;
    children: React.ReactElement;
}) {
    function getStyle() {
        let base = "rounded-3xl mt-5 px-5 py-3 w-fit";
        let rounding = type == "user" ? "rounded-br-none " : "rounded-bl-none";
        let bgColor = isMagic
            ? "bg-appLightBlue"
            : type == "user"
            ? "bg-appParrot"
            : "bg-appTeal";

        return `${base} ${rounding} ${bgColor}`;
    }
    return (
        <div
            className={`flex flex-row items-center ${
                type == "user" ? "justify-end" : "justify-start"
            }`}
        >
            <div className="max-w-[55%]">
                {isMagic && (
                    <Image
                        src={magicIcon}
                        alt="magic_icon"
                        height={20}
                        width={20}
                        className="mr-3"
                    />
                )}
                <div className={getStyle()}>{children}</div>
            </div>
        </div>
    );
}
