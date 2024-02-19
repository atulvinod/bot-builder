import { db_client } from "@/lib/db";
import * as schemas from "../../../../schemas/schemas";
import { and, eq } from "drizzle-orm";
import { Button } from "@/app/shared/buttons";
import Link from "next/link";

export default async function BotSuccessPage({
    searchParams,
}: {
    searchParams: { bot_id: string };
}) {
    const [bot_details] = await db_client
        .select({ id: schemas.botDetails.id, name: schemas.botDetails.name })
        .from(schemas.botDetails)
        .where(
            and(
                eq(schemas.botDetails.created_by_user_id, 1),
                eq(schemas.botDetails.id, Number(searchParams.bot_id))
            )
        );

    return (
        <div>
            <h1 className="text-7xl my-5">Success!</h1>
            <div className="my-10">
                <p className="w-[30%]">
                    Your bot &quot;{bot_details.name}&quot; being created, it
                    will be ready in some time as we are training on your data.
                    We will inform you once its ready
                </p>
            </div>
            <div className="my-10">
                <Link href={"/dashboard/bots"}>
                    <Button buttonText="Go to dashboard"></Button>
                </Link>
            </div>
        </div>
    );
}
