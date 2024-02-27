import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function ServerAuthGuard({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authConfig);
    if (!session) {
        redirect("/");
    }
	console.log("SESSION USER ",session);
    return <>{children}</>;
}
