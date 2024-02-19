import Image from "next/image";
import AvatarImage from "./avatar_image";
export default function Navbar() {
    return (
        <nav className="h-20 w-full border-b border-slate-200 border-solid flex items-center justify-between px-5">
            <div>
                <h1>Navbar Logo</h1>
            </div>
            <div>
                <AvatarImage></AvatarImage>
            </div>
        </nav>
    );
}
