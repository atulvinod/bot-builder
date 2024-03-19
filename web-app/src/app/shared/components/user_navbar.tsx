"use client";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import AvatarImage from "./avatar_image";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn } from "lucide-react";
import GoogleButton from "react-google-button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot } from "lucide-react";
import Link from "next/link";
import "./navbar.styles.css";

export default function NavbarUser() {
    return (
        <SessionProvider>
            <User />
        </SessionProvider>
    );
}

function User() {
    const session = useSession();

    return (
        <div>
            {session.status == "authenticated" && (
                <div className="flex items-center">
                    <ul className="navbar-links mr-10">
                        <li className="hover:underline">
                            <Link href="/dashboard/bots">
                                <Bot className="mb-0.5" />
                                <span className="ml-1 text-lg">Your bots</span>
                            </Link>
                        </li>
                    </ul>

                    <Popover>
                        <PopoverTrigger>
                            <AvatarImage path={session.data?.user?.image} />
                        </PopoverTrigger>
                        <PopoverContent>
                            <h1 className="font-semibold">
                                Hello {session.data?.user?.name}
                            </h1>
                            <hr className="my-2" />
                            <div className="mt-2">
                                <Button
                                    variant={"secondary"}
                                    onClick={() => signOut()}
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            )}
            {session.status == "unauthenticated" && (
                <div className="flex ">
                    <Dialog>
                        <DialogTrigger>
                            <Button variant={"outline"}>
                                <LogIn className="w-4 h-4 mr-2" />
                                Log-in
                            </Button>
                        </DialogTrigger>
                        <DialogContent hideClose={true}>
                            <div className="flex flex-col items-center">
                                <h1 className="text-3xl font-semibold">
                                    Login
                                </h1>
                                <p className="my-3">
                                    To continue, you need to login
                                </p>
                                <div className="mt-2">
                                    <GoogleButton
                                        onClick={() => signIn("google")}
                                    />
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            )}
            {session.status == "loading" && <Skeleton className="w-36 h-10" />}
        </div>
    );
}
