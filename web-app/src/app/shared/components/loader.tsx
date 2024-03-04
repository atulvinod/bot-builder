import {Loader2} from "lucide-react";

export default function Loader(){
    
    return (
        <div className="h-full">
        <div className="flex items-center justify-center h-full w-full  ">
            <Loader2 className="h-20 w-20 animate-spin" />
        </div>
    </div>
    )
}