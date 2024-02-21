import { db_client } from "@/lib/db";
import * as schema from "../../../schemas/schemas";
import { eq } from "drizzle-orm";
import AvatarImage from "@/app/shared/components/avatar_image";
import { Button, ButtonVariants } from "@/app/shared/components/buttons";
import infoIcon from "../../../svgs/info.svg";
import moreIcon from "../../../svgs/more.svg";
import Image from "next/image";

export default async function ChatPageLayout({
    params,
    children,
}: {
    params: { bot_id: number };
    children: React.ReactNode;
}) {
    const [botDetails] = await db_client
        .select()
        .from(schema.botDetails)
        .where(eq(schema.botDetails.id, params.bot_id));
    return (
        <div className="h-[100vh] flex flex-col">
            <nav className="h-20 w-full border-b border-slate-200 border-solid flex items-center justify-between px-5">
                <div className="flex flex-row items-center">
                    <AvatarImage />
                    <span className="ml-2 text-xl">{botDetails.name}</span>
                </div>
                <div className="flex flex-row items-center">
                    <div>
                        <Button
                            buttonText={"Clear Chat"}
                            variant={ButtonVariants.Muted}
                        />
                    </div>

                    <div className="ml-2">
                        <Button
                            variant={ButtonVariants.Muted}
                            icon={
                                <Image
                                    alt="info-icon"
                                    src={infoIcon}
                                    width={20}
                                    height={20}
                                />
                            }
                        />
                    </div>
                    <div className="ml-2">
                        <Button
                            variant={ButtonVariants.Muted}
                            icon={
                                <Image
                                    alt="more-icon"
                                    src={moreIcon}
                                    width={20}
                                    height={20}
                                />
                            }
                        />
                    </div>
                </div>
            </nav>
            <div className="h-full">{children}</div>
        </div>
    );
}
