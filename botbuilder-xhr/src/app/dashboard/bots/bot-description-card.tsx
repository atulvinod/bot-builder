import AvatarImage from "@/app/shared/avatar_image";
import Link from "next/link";

export default function BotDescription({
    avatar_image,
    bot_id,
    bot_name,
    bot_description,
}: {
    bot_id: number;
    avatar_image: string;
    bot_name: string;
    bot_description: string;
}) {
    return (
        <Link href={`/dashboard/bots/${bot_id}`}>
            <div className="rounded-lg bg-appGrey p-5 pb-10 cursor-pointer">
                <div className="flex flex-row items-center">
                    <AvatarImage path={avatar_image}></AvatarImage>
                    <span className="text-lg ml-3 break-all">{bot_name}</span>
                </div>
                <div className="mt-3">
                    <p className="text-slate-500 text-sm break-all">
                        {bot_description}
                    </p>
                </div>
            </div>
        </Link>
    );
}
