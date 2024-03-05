import Image from "next/image";
import magicIcon from "../../../../svgs/sparkling.svg";
import "animate.css";

export default function ChatBubble({
    role: type,
    isMagic = false,
    children,
    onClick = () => {},
    animate = false,
}: {
    role: "user" | "assistant";
    isMagic?: boolean;
    children: React.ReactElement;
    onClick?: () => void;
    animate?: boolean;
}) {
    function getStyle() {
        let base = "rounded-3xl  px-5 py-3 w-fit";
        let rounding = type == "user" ? "rounded-br-none " : "rounded-bl-none";
        let bgColor = isMagic
            ? "bg-appLightBlue cursor-pointer"
            : type == "user"
            ? "bg-appParrot"
            : "bg-appTeal";

        return `${base} ${rounding} ${bgColor}`;
    }
    return (
        <div
            className={`flex flex-row items-center mt-5 ${
                animate ? "animate__animated animate__fadeInUp" : ""
            } ${type == "user" ? "justify-end" : "justify-start"}`}
        >
            <div
                onClick={onClick}
                className={
                    `max-w-[55%] flex flex-row items-center` +
                    (isMagic
                        ? "transition-transform duration-300 transform hover:translate-y-[-5px]"
                        : "")
                }
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
                <div className={getStyle()}>{children}</div>
            </div>
        </div>
    );
}
