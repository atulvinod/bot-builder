import { Button, ButtonVariants } from "./buttons";

export default function HeadingWithSideActionButton({
    heading,
    children,
}: {
    heading: string;
    children?: React.ReactNode;
}) {
    return (
        <>
            <div className="flex justify-between">
                <h1 className="text-4xl">{heading}</h1>
                {children}
            </div>
            <hr className="my-10" />
        </>
    );
}
