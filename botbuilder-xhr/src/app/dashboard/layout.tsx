import Navbar from "../shared/navbar";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main>
            <Navbar></Navbar>
            <div className="p-10">{children}</div>
        </main>
    );
}
