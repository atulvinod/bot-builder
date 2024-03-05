import { getChatServiceHost } from "@/app/shared/utils";
import { db_client } from "@/lib/db";
import * as schema from "../../../schemas/schemas";
import { eq } from "drizzle-orm";
import ChatPageRoot from "./page";

const CHAT_SERVICE_HOST = getChatServiceHost();

export default async function ChatPageLayout({
    params,
    children,
}: {
    children: React.ReactElement;
    params: { bot_id: number };
}) {
    const [{ bot_details: botDetails, users: createdByUser }] = await db_client
        .select()
        .from(schema.botDetails)
        .innerJoin(
            schema.user,
            eq(schema.botDetails.created_by_user_id, schema.user.id)
        )
        .where(eq(schema.botDetails.id, params.bot_id))
        .limit(1);

    let suggestedQuestions = [];
    const suggestedQuestionsRequest = await fetch(
        `${CHAT_SERVICE_HOST}/bot/${params.bot_id}/suggested_questions`,
        {
            cache: "no-store",
        }
    );

    if (suggestedQuestionsRequest.ok) {
        const suggestedQuestionsBody = await suggestedQuestionsRequest.json();
        suggestedQuestions.push(...suggestedQuestionsBody.data.questions);
    }

    return (
        <>
            <ChatPageRoot
                bot_details={botDetails}
                created_by_user={createdByUser}
                suggested_questions={suggestedQuestions}
            />
        </>
    );
}
