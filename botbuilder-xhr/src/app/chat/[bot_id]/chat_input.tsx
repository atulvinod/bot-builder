import {
    Button,
    ButtonSize,
    ButtonVariants,
} from "@/app/shared/components/buttons";

export function ChatInput({}) {
    return (
        <div className="flex flex-row mb-10">
            <div className="h-16 bg-appGrey rounded-full flex-auto">
                <div className="h-full px-10">
                    <input
                        type="text"
                        className="h-full w-full bg-transparent outline-none"
                        placeholder="Ask a question?"
                    />
                </div>
            </div>
            <div className="ml-3">
                <Button
                    buttonText="Send"
                    variant={ButtonVariants.Muted}
                    size={ButtonSize.MaxHeight}
                />
            </div>
        </div>
    );
}
