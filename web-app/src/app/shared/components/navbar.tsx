import Image from "next/image";
import AvatarImage from "./avatar_image";
import { getServerSession } from "next-auth";
export default async function Navbar() {
    const session = await getServerSession();

    return (
        <nav className="h-20 w-full border-b border-slate-200 border-solid flex items-center justify-between px-5">
            <div>
                <h1>Navbar Logo</h1>
            </div>
            <div>
                <AvatarImage path={session?.user?.image}></AvatarImage>
            </div>
        </nav>
    );
}
