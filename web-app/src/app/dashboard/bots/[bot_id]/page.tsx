"use client";

import {
    Button as AppButton,
    ButtonVariants,
} from "@/app/shared/components/buttons";
import HeadingWithSideActionButton from "@/app/shared/components/heading_with_side_action_button";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useQuery } from "@tanstack/react-query";
import { Loader2, Loader } from "lucide-react";
import * as schema from "../../../../schemas/schemas";
import Image from "next/image";
import { DEFAULT_AVATAR, TrainingAssetTypes } from "@/lib/constants";
import {
    TrainingData,
    TrainingFilesConfig,
} from "@/app/shared/components/interfaces";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function BotDetailsPage({
    params,
}: {
    params: { bot_id: number };
}) {
    const getBotDetails = async (): Promise<
        typeof schema.botDetails.$inferSelect
    > => {
        const response = await fetch(`/api/bot?bot_id=${params.bot_id}`);
        const responseBody = await response.json();
        return responseBody.data.details;
    };

    const router = useRouter();


    const { data: botDetails, isLoading } = useQuery({
        queryKey: ["bot_details"],
        queryFn: getBotDetails,
    });

    return (
        <>
            {isLoading && (
                <div className="flex items-center justify-center h-[80vh]">
                    <Loader2 className="animate-spin w-20 h-20" />
                </div>
            )}
            {!isLoading && (
                <div>
                    <HeadingWithSideActionButton heading={"Bot details"}>
                        <ActionButtons
                            bot_id={params.bot_id}
                            status={botDetails?.status ?? "queued"}
                        />
                    </HeadingWithSideActionButton>
                    <div>
                        <div className="w-[50%]">
                            <div>
                                <label className="text-lg font-medium">
                                    Name
                                </label>
                                <div className="flex flex-row items-start">
                                    <div>
                                        <div className="mt-2">
                                            <div className="w-48 h-48 rounded-full bg-slate-400 relative overflow-clip">
                                                <Image
                                                    src={
                                                        botDetails?.avatar_image ??
                                                        DEFAULT_AVATAR
                                                    }
                                                    alt="bot avatar image"
                                                    className="object-fill"
                                                    layout="fill"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <label className="mt-8 ml-5 flex-auto">
                                        <Input
                                            value={botDetails?.name}
                                            disabled
                                        />
                                        <div className="border-1 bg-yellow-100 rounded-md p-4 text-sm text-muted-foreground mt-1.5">
                                            Name displayed to the users
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <div className="mt-10">
                                <label className="text-lg font-medium">
                                    Description
                                </label>
                                <Textarea
                                    className="mt-1.5 "
                                    value={botDetails?.description}
                                    disabled
                                />
                                <div className="border-1 bg-yellow-100 rounded-md p-4 text-sm text-muted-foreground mt-1.5">
                                    A bot description is like an introduction
                                    for a chatbot. It helps the chatbot know
                                    what it&apos;s supposed to do and what kind
                                    of answers it should give. It also tells
                                    users what the bot can help with, giving
                                    them an idea of what to expect.
                                </div>
                            </div>
                            <div className="mt-10">
                                <label className="text-lg font-medium">
                                    Training Data
                                </label>
                                <div className="w-[60%] mt-1.5">
                                    {(
                                        botDetails?.spec!! as {
                                            training_spec: TrainingData[];
                                        }
                                    ).training_spec.map((tdi, idx) => {
                                        if (
                                            tdi.type == TrainingAssetTypes.Files
                                        ) {
                                            return (
                                                <div key={idx}>
                                                    <FileTrainingDataDescription
                                                        data={
                                                            tdi.config as TrainingFilesConfig[]
                                                        }
                                                    />
                                                </div>
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function FileTrainingDataDescription({
    data,
}: {
    data: TrainingFilesConfig[];
}) {
    return (
        <div className="p-4 bg-appGrey rounded-lg">
            <div>
                <span className="text-2xl font-medium">Files</span>
                {data.map((d, idx1) => (
                    <div className="border-2 mt-2 p-2" key={idx1}>
                        <span className="underline text-lg">Context</span>
                        <Textarea
                            value={d.context}
                            disabled
                            className="text-black mt-1"
                        />

                        <div className="mt-1">
                            <span className="underline text-lg">Files</span>
                            {d.files?.map((f, idx2) => (
                                <div key={idx2} className="mt-1.5">
                                    <span className="text-sm">{f.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ActionButtons({ status, bot_id }: { status: string; bot_id: number }) {
    const router = useRouter();

    return (
        <div className="flex ">
            <div className="mr-4">
                {status == "created" ? (
                    <AppButton
                        onClick={() => router.push(`/chat/${bot_id}`)}
                        variant={ButtonVariants.Magic}
                        buttonText="Open"
                        icon={<ExternalLink className="h-5 w-5 mr-2" />}
                    ></AppButton>
                ) : (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Badge
                                    variant={"outline"}
                                    className="bg-yellow-100 px-4 h-11"
                                >
                                    <Loader className="h-5 w-5 mr-2 animate-spin" />
                                    <span className="text-sm font-normal text-[16px]">
                                        Processing
                                    </span>
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                                We are working on the bot, please check back
                                later
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
            <AppButton
                variant={ButtonVariants.Danger}
                buttonText={"Delete"}
            ></AppButton>
        </div>
    );
}