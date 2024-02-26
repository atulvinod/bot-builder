import { Button, ButtonVariants } from "@/app/shared/components/buttons";
import BotDescription from "./bot-description-card";
import HeadingWithSideActionButton from "@/app/shared/components/heading_with_side_action_button";
import { db_client } from "@/lib/db";
import * as schema from "../../../schemas/schemas";
import { eq } from "drizzle-orm";
import Link from "next/link";

export default async function ViewBotsPage() {
    const bots = await db_client
        .select()
        .from(schema.botDetails)
        .where(eq(schema.botDetails.created_by_user_id, 1));

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
                        avatar_image="https://api.dicebear.com/7.x/pixel-art/svg"
                        bot_description={m.description}
                        bot_name={m.name}
                        bot_id={m.id}
                        status={m.status ?? "queued"}
                    />
                ))}
            </div>
        </div>
    );
}
