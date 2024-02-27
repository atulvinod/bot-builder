import { authConfig } from "@/lib/auth";
import Navbar from "../shared/components/navbar";
import { getServerSession } from "next-auth/next";
import { ServerAuthGuard } from "../shared/components/auth/authguard-server";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ServerAuthGuard>
            <main>
                <Navbar></Navbar>
                <div className="p-10">{children}</div>
            </main>
        </ServerAuthGuard>
    );
}
