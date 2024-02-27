import Image from "next/image";

export default function AvatarImage({ path }: { path?: string | null }) {
    const getPath = () =>
        path == null || !path.trim().length
            ? "https://api.dicebear.com/7.x/pixel-art/svg"
            : path;
    return (
        <div className="border-2 rounded-full h-12 w-12 flex items-center justify-center overflow-clip relative">
            <Image
                src={getPath()}
                alt="random image"
                objectFit="contain"
                layout="fill"
            />
        </div>
    );
}
