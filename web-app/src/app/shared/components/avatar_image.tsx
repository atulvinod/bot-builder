import Image from "next/image";

export default function AvatarImage({
    path = "https://api.dicebear.com/7.x/pixel-art/svg",
}: {
    path?: string | null;
}) {
    return (
        <div className="border-2 rounded-full h-12 w-12 flex items-center justify-center overflow-clip relative">
            <Image
                src={path!!}
                alt="random image"
                objectFit="contain"
                layout="fill"
            />
        </div>
    );
}
