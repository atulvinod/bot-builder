"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Helloworld() {
    return (
        <div>
            <Button onClick={() => signIn("google")}>Sign In</Button>
        </div>
    );
}
