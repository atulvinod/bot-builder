import * as schema from "../../../schemas/schemas";
import { ChatInput } from "./chat_input";
import ChatBubble from "./message_bubble";

export default function ChatPanel({
    bot_details,
}: {
    bot_details: typeof schema.botDetails.$inferSelect;
}) {
    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex-auto  flex flex-col justify-end mb-4">
                <ChatBubble type={"user"} isMagic={true}>
                    <span>Hello world</span>
                </ChatBubble>
            </div>
            <ChatInput />
        </div>
    );
}
