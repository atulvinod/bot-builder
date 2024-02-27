"use client";
import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Helloworld() {
    return (
        <div>
            <Button variant={"default"} onClick={() => signIn("google")}>
                Sign In
            </Button>
            <Button variant={"default"} onClick={() => signOut()}>
                Sign out
            </Button>
        </div>
    );
}
