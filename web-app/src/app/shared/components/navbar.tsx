import AvatarImage from "./avatar_image";
import { getServerSession } from "next-auth";
import Breadcrumbs from "./breadcrumbs";
import NavbarUser from "./user_navbar";

export default async function Navbar() {
    const session = await getServerSession();
    return (
        <nav className="h-20 w-full border-b border-slate-200 border-solid flex items-center justify-between px-5">
            <div className="flex items-center">
                <h1>Navbar Logo</h1>
                <Breadcrumbs />
            </div>
            <div>
                <NavbarUser />
            </div>
        </nav>
    );
}
