import { Bot } from "lucide-react"
import Link from "next/link"

export default function Logo(){
    return (
        <Link href={"/"}>
        <div className="flex items-center">
            <div className="border rounded-full p-2">
                <Bot />
            </div>
            <h1 className="text-xl ml-2">Botmaker </h1>
        </div>
    </Link>
    )
}