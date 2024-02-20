import AvatarImage from "@/app/shared/avatar_image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import openExternalSvg from "../../../svgs/open-external.svg"
import Image from "next/image";

type botStatus = "queued" | "inprogress" | "created" | "failed";

export default function BotDescription({
    avatar_image,
    bot_id,
    bot_name,
    bot_description,
    status,
}: {
    bot_id: number;
    avatar_image: string;
    bot_name: string;
    bot_description: string;
    status: botStatus;
}) {
    return (
        <Link href={`/dashboard/bots/${bot_id}`}>
            <div className="rounded-lg bg-appGrey p-5  cursor-pointer">
                <div className="flex flex-row items-center">
                    <AvatarImage path={avatar_image}></AvatarImage>
                    <span className="text-lg ml-3 break-all">{bot_name}</span>
                </div>
                <div className="mt-3">
                    <p className="text-slate-500 text-sm break-all">
                        {bot_description}
                    </p>
                </div>
                <div className="mt-3">
                    {status == "queued" && (
                        <Badge variant={"outline"} className="bg-yellow-100 h-7">
                            Processing
                        </Badge>
                    )}
                    {status == "created" && (
                        <Badge variant={"outline"} className="bg-green-400 h-7">
                            Open
                            <Image
                            alt="Open"
                            src={openExternalSvg}
                            height={12}
                            width={12}
                            className="ml-1"
                            >

                            </Image>
                        </Badge>
                    )}
                </div>
            </div>
        </Link>
    );
}
