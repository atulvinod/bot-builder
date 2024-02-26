import * as schemas from "../../../schemas/schemas";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShieldAlert, MessageSquare } from "lucide-react";
import AvatarImage from "@/app/shared/components/avatar_image";
import { Button, ButtonVariants } from "@/app/shared/components/buttons";
import infoIcon from "../../../svgs/info.svg";
import moreIcon from "../../../svgs/more.svg";
import Image from "next/image";

export function ChatPageNav({
    bot_details,
}: {
    bot_details: typeof schemas.botDetails.$inferSelect;
}) {
    return (
        <nav className="h-20 w-full border-b border-slate-200 border-solid flex items-center justify-between px-5 fixed bg-white">
            <div className="flex flex-row items-center">
                <AvatarImage />
                <span className="ml-2 text-xl">{bot_details.name}</span>
            </div>
            <div className="flex flex-row items-center">
                <div>
                    <Button
                        buttonText={"Clear Chat"}
                        variant={ButtonVariants.Muted}
                    />
                </div>

                <div className="ml-2">
                    <Dialog>
                        <DialogTrigger>
                            <Button
                                variant={ButtonVariants.Muted}
                                icon={
                                    <Image
                                        alt="info-icon"
                                        src={infoIcon}
                                        width={20}
                                        height={20}
                                    />
                                }
                            />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Bot Details</DialogTitle>
                            </DialogHeader>
                            <hr />
                            <span className="text-2xl mt-2">
                                {bot_details.name}
                            </span>
                            <div className="mt-2">
                                <p>{bot_details.description}</p>
                                <p className="mt-3">
                                    <span>Created by </span>
                                    <span>
                                        {bot_details.created_by_user_id}
                                    </span>
                                </p>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="ml-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button
                                variant={ButtonVariants.Muted}
                                icon={
                                    <Image
                                        alt="more-icon"
                                        src={moreIcon}
                                        width={20}
                                        height={20}
                                    />
                                }
                            />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Menu</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem>
                                <span>
                                    <MessageSquare className="mr-2" />
                                </span>
                                <span>Feedback for bot</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <span>
                                    <ShieldAlert className="mr-2 text-red-400" />
                                </span>
                                <span className="text-red-500">
                                    Report a problem
                                </span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
}
