import Loader from "@/app/shared/components/loader";
import { Loader2 } from "lucide-react";

export default function LoadingPage() {
    return (
        <div className="h-[100vh] flex flex-col">
            <nav className="h-20 w-full border-b border-slate-200 border-solid flex items-center justify-between px-5"></nav>
            <Loader />
        </div>
    );
}
