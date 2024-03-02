"use client";
import AvatarImage from "@/app/shared/components/avatar_image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import openExternalSvg from "../../../svgs/open-external.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

type botStatus = "queued" | "inprogress" | "created" | "failed" |"failed_queue_push";

export default function BotDescription({
    avatar_image,
    bot_id,
    bot_name,
    bot_description,
    status,
}: {
    bot_id: number;
    avatar_image?: string | null;
    bot_name: string;
    bot_description: string;
    status: botStatus;
}) {
    const router = useRouter();
    const botLink = `/dashboard/bots/${bot_id}`;
    return (
        <div
            className="rounded-lg bg-appGrey p-5  cursor-pointer"
            onClick={() => router.push(botLink)}
        >
            <div className="h-full flex flex-col">
                <div className="flex flex-row items-center">
                    <AvatarImage path={avatar_image}></AvatarImage>
                    <span className="text-lg ml-3 break-all">{bot_name}</span>
                </div>
                <div className="mt-3 flex-auto">
                    <p className="text-slate-500 text-sm break-all">
                        {bot_description}
                    </p>
                </div>
                <div className="mt-3">
                    {["queued", "inprogress", "failed_queue_push"].includes(
                        status
                    ) && (
                        <Badge
                            variant={"outline"}
                            className="bg-yellow-100 h-7"
                        >
                            Processing
                        </Badge>
                    )}
                    {status == "created" && (
                        <Link href={`/chat/${bot_id}`}>
                            <Badge
                                variant={"outline"}
                                className="bg-green-400 h-7"
                            >
                                Open
                                <Image
                                    alt="Open"
                                    src={openExternalSvg}
                                    height={12}
                                    width={12}
                                    className="ml-1"
                                ></Image>
                            </Badge>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
