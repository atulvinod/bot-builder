import { Loader2 } from "lucide-react";

export default function LoadingPage() {
    return (
        <div className="h-[100vh] flex flex-col">
            <nav className="h-20 w-full border-b border-slate-200 border-solid flex items-center justify-between px-5"></nav>
            <div className="h-full">
                <div className="flex items-center justify-center h-full w-full  ">
                    <Loader2 className="h-20 w-20 animate-spin" />
                </div>
            </div>
        </div>
    );
}
