import { DEFAULT_AVATAR } from "@/lib/constants";
import Image from "next/image";
import clsx from "clsx";

export default function AvatarImage({
    path,
    heightWidthClasses = "h-12 w-12",
}: {
    path?: string | null;
    heightWidthClasses?: string;
}) {
    const getPath = () =>
        path == null || !path.trim().length ? DEFAULT_AVATAR : path;
    return (
        <div
            className={clsx(
                "border-2",
                "rounded-full",
                "flex",
                "items-center",
                "justify-center",
                "overflow-clip",
                "relative",
                heightWidthClasses
            )}
        >
            <Image
                src={getPath()}
                alt="random image"
                objectFit="contain"
                layout="fill"
            />
        </div>
    );
}
