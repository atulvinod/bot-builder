import { Button, ButtonVariants } from "@/app/shared/components/buttons";
import BotDescription from "./bot-description-card";
import HeadingWithSideActionButton from "@/app/shared/components/heading_with_side_action_button";
import { db_client } from "@/lib/db";
import * as schema from "../../../schemas/schemas";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { getUser } from "@/lib/auth";

export default async function ViewBotsPage() {
    const session = await getUser();
    const bots = await db_client
        .select()
        .from(schema.botDetails)
        .innerJoin(
            schema.user,
            eq(schema.user.id, schema.botDetails.created_by_user_id)
        )
        .where(eq(schema.botDetails.created_by_user_id, session?.user!!.id));

    return (
        <div>
            <HeadingWithSideActionButton heading="Your bots!">
                <Link href={"/dashboard/bots/create"}>
                    <Button
                        buttonText="Create new"
                        variant={ButtonVariants.Magic}
                    ></Button>
                </Link>
            </HeadingWithSideActionButton>
            <div className="grid grid-cols-5 gap-5">
                {bots.map((m, i) => (
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
