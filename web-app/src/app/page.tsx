import { getUser } from "@/lib/auth";
import { Button, ButtonVariants } from "./shared/components/buttons";
import HeadingWithSideActionButton from "./shared/components/heading_with_side_action_button";
import Navbar from "./shared/components/navbar";
import Link from "next/link";
import { db_client } from "@/lib/db";
import * as schemas from "../schemas/schemas";
import { and, eq } from "drizzle-orm";
import BotDescription from "./dashboard/bots/bot-description-card";

export default async function Root() {
    const session = await getUser();
    const bots = await db_client
        .select()
        .from(schemas.botDetails)
        .where(
            and(
                eq(schemas.botDetails.is_private, false),
                eq(schemas.botDetails.status, "created")
            )
        );

    return (
        <main>
            <Navbar />
            <div className="p-10">
                <HeadingWithSideActionButton heading="All bots">
                    {session?.user && (
                        <Link href={"/dashboard/bots/create"} target="_blank">
                            <Button
                                variant={ButtonVariants.Magic}
                                buttonText="Create your own"
                            />
                        </Link>
                    )}
                </HeadingWithSideActionButton>
                <div className="mt-2 grid grid-cols-5 gap-5">
                    {bots.map((element, index) => (
                        <BotDescription
                            navigate_to_desc={false}
                            key={index}
                            bot_description={element.description}
                            bot_id={element.id}
                            bot_name={element.name}
                            status="created"
                            avatar_image={element.avatar_image}
                        ></BotDescription>
                    ))}
                </div>
            </div>
        </main>
    );
}
