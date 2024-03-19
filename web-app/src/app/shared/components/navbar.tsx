import Breadcrumbs from "./breadcrumbs";
import NavbarUser from "./user_navbar";
import Logo from "./logo";
export default async function Navbar() {
    return (
        <nav className="h-20 w-full border-b border-slate-200 border-solid flex items-center justify-between px-5">
            <div className="flex items-center">
                <Logo />

                <Breadcrumbs />
            </div>
            <div>
                <NavbarUser />
            </div>
        </nav>
    );
}
