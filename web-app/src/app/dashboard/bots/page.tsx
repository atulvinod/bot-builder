import { Button, ButtonVariants } from "@/app/shared/components/buttons";
import BotDescription from "./bot-description-card";
import HeadingWithSideActionButton from "@/app/shared/components/heading_with_side_action_button";
import { db_client } from "@/lib/db";
import * as schema from "../../../schemas/schemas";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { getUser } from "@/lib/auth";
import { unstable_noStore } from "next/cache";
import Image from "next/image";

import nodata from "../../../svgs/nodata.svg";

export const dynamic = "force-dynamic";

export default async function ViewBotsPage() {
    unstable_noStore();
    const session = await getUser();
    const bots = await db_client
        .select()
        .from(schema.botDetails)
        .innerJoin(
            schema.user,
            eq(schema.user.id, schema.botDetails.created_by_user_id)
        )
        .where(eq(schema.botDetails.created_by_user_id, session?.user!!.id))
        .orderBy(desc(schema.botDetails.created_at));

    return (
        <div>
            <HeadingWithSideActionButton heading="Your bots">
                <Link href={"/dashboard/bots/create"}>
                    <Button
                        buttonText="Create new"
                        variant={ButtonVariants.Magic}
                    ></Button>
                </Link>
            </HeadingWithSideActionButton>
            {(bots ?? []).length == 0 && (
                <div className="flex justify-center">
                    <div className="flex flex-col items-center">
                        <Image
                            src={nodata}
                            width={300}
                            height={300}
                            alt="no data"
                        />
                        <span className="text-gray-800 text-2xl mt-2">
                            {" "}
                            You don't have any bots yet
                        </span>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-5 gap-5">
                {(bots ?? []).map((m, i) => (
                    <BotDescription
                        key={i}
                        bot_description={m.bot_details.description}
                        bot_name={m.bot_details.name}
                        bot_id={m.bot_details.id}
                        status={m.bot_details.status ?? "queued"}
                        avatar_image={m.bot_details.avatar_image}
                    />
                ))}
            </div>
        </div>
    );
}
