import { eq } from "drizzle-orm";
import * as schemas from "../../schemas/schemas";
import { db_client } from "@/lib/db";

export async function getUserByEmail(email: string) {
    const [user] = await db_client
        .select()
        .from(schemas.user)
        .where(eq(schemas.user.email, email))
        .limit(1);

    return user;
}

export async function createUser(
    name: string,
    email: string,
    picture?: string | null
) {
    const obj: typeof schemas.user.$inferInsert = {
        name,
        email,
        picture,
    };
    await db_client.insert(schemas.user).values(obj).returning();
    return obj;
}
