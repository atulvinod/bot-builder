"use client";

import {
    Button as AppButton,
    Button,
    ButtonVariants,
} from "@/app/shared/components/buttons";
import HeadingWithSideActionButton from "@/app/shared/components/heading_with_side_action_button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";
import {
    TrainingData,
    TrainingFilesConfig,
} from "@/app/shared/components/interfaces";
import { TrainingFilesInputConfigV2 } from "@/app/shared/utils";
import * as constants from "@/lib/constants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ImageInput } from "@/app/shared/components/image-input/image-input";
import TrainingFilesInputV2, {
    FileTrainingData,
} from "@/app/shared/components/file_training_data_input";
import Link from "next/link";
import { SessionProvider, useSession } from "next-auth/react";

const formSchema = z.object({
    botname: z
        .string({ required_error: "Botname is required" })
        .min(
            constants.MIN_BOT_NAME_LENGTH,
            "Botname should be atleast 10 characters"
        )
        .max(
            constants.MAX_BOT_NAME_LENGTH,
            "Botname should be at max 50 characters"
        ),
    bot_description: z
        .string({ required_error: "Bot description is required" })
        .min(
            50,
            "We encourage a good description as it will enhance the ability of the bot to answer precisely, hence minimum 50 characters are required"
        ),
});

export default function CreateBotPage() {
    return (
        <SessionProvider>
            <Content />
        </SessionProvider>
    );
}

export function Content() {
    const router = useRouter();
    const session = useSession();
    const [trainingDataErrors, setTrainingDataErrors] = useState<string[][]>(
        []
    );
    const [isRequestProcessing, setIsRequestProcessing] =
        useState<boolean>(false);

    const [avatarImage, setAvatarImage] = useState<File>();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const [isBotCreated, setBotCreated] = useState<boolean>(false);

    type FormDataStruct = z.infer<typeof formSchema>;

    const [trainingDataInputs, setTrainingDataInputs] = useState<
        TrainingFilesInputConfigV2[]
    >([new TrainingFilesInputConfigV2()]);

    const appendTrainingDataToForm = (formData: FormData) => {
        const trainingSpec: TrainingData[] = [];

        trainingDataInputs.forEach((data) => {
            if (data.type == constants.TrainingAssetTypes.Files) {
                const fileTrainingSpec: TrainingFilesConfig[] = [];

                (data.value as FileTrainingData[]).forEach((data, idx) => {
                    const filesId = `file-${idx}`;
                    const spec = {
                        context: data.value.context,
                        files_id: filesId,
                    };
                    for (let i = 0; i < data.value.files.length; i++) {
                        formData.append(filesId, data.value.files[i]);
                    }
                    fileTrainingSpec.push(spec);
                });

                trainingSpec.push({
                    type: constants.TrainingAssetTypes.Files,
                    config: fileTrainingSpec,
                });
            }
        });
        formData.append(constants.TRAINING_SPEC, JSON.stringify(trainingSpec));
    };

    const buildFromObject = (formData: FormDataStruct) => {
        const uploadFormPayload = new FormData();
        appendTrainingDataToForm(uploadFormPayload);
        uploadFormPayload.append(constants.BOT_NAME, formData.botname);
        uploadFormPayload.append(
            constants.BOT_DESCRIPTION,
            formData.bot_description
        );
        if (avatarImage) {
            uploadFormPayload.append(constants.BOT_AVATAR, avatarImage);
        }
        return uploadFormPayload;
    };

    const publishBot = async (formData: FormDataStruct) => {
        const isTrainingDataValid = validateTrainingInputs();
        if (!isTrainingDataValid) {
            return;
        }
        const uploadFormPayload = buildFromObject(formData);
        try {
            setIsRequestProcessing(true);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_UPLOAD_SERVICE_API}/upload`,
                {
                    method: "POST",
                    body: uploadFormPayload,
                    headers: {
                        Authorization: `Bearer ${session.data?.jwt}`,
                    },
                }
            );
            if (!response.ok) {
                toast.error(
                    "An unexpected error occurred, please try again later"
                );
            } else {
                setBotCreated(true);
            }
        } catch (e: any) {
            toast.error("An unexpected error occurred, please try again later");
        } finally {
            setIsRequestProcessing(false);
        }
    };

    /**
     * Submit attempted function here is to control the application of validation.
     * Only apply validation when the form has submitted at least once
     */
    const submitAttempted = useRef(false);
    const validateTrainingInputs = function () {
        if (!submitAttempted.current) {
            return null;
        }
        let errors: string[][] = [];
        trainingDataInputs.forEach((input) => {
            if (!input.isValid()) {
                errors.push(input.errors);
            }
        });
        setTrainingDataErrors(errors);
        return !!!errors.length;
    };

    return (
        <>
            {!isBotCreated ? (
                <Form {...form}>
                    <form
                        onSubmit={(e) => {
                            submitAttempted.current = true;
                            validateTrainingInputs();
                            form.handleSubmit(publishBot)(e);
                        }}
                    >
                        <div>
                            <HeadingWithSideActionButton
                                heading={"Create new bot"}
                            >
                                <AppButton
                                    type="submit"
                                    variant={
                                        isRequestProcessing
                                            ? ButtonVariants.Loading
                                            : ButtonVariants.Magic
                                    }
                                    buttonText={
                                        isRequestProcessing
                                            ? "Publishing"
                                            : "Publish"
                                    }
                                ></AppButton>
                            </HeadingWithSideActionButton>
                            <div>
                                <div className="w-[50%]">
                                    <FormField
                                        control={form.control}
                                        name="botname"
                                        render={({ field }) => (
                                            <div>
                                                <FormLabel className="text-lg">
                                                    Name
                                                </FormLabel>
                                                <div className="flex flex-row items-start">
                                                    <div>
                                                        <div className="mt-2">
                                                            <ImageInput
                                                                isDisabled={
                                                                    isRequestProcessing
                                                                }
                                                                handleSetImage={
                                                                    setAvatarImage
                                                                }
                                                            />
                                                        </div>
                                                    </div>

                                                    <FormItem className="mt-8 ml-5 flex-auto">
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                placeholder="Add a bot name"
                                                                disabled={
                                                                    isRequestProcessing
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                        <FormDescription className="border-1 bg-yellow-100 rounded-md p-4">
                                                            Name displayed to
                                                            the users
                                                        </FormDescription>
                                                    </FormItem>
                                                </div>
                                            </div>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="bot_description"
                                        render={({ field }) => (
                                            <FormItem className="mt-10">
                                                <FormLabel className="text-lg">
                                                    Description
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        {...field}
                                                        placeholder="Add a bot description"
                                                        disabled={
                                                            isRequestProcessing
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                                <FormDescription className="border-1 bg-yellow-100 rounded-md p-4">
                                                    A bot description is like an
                                                    introduction for a chatbot.
                                                    It helps the chatbot know
                                                    what it&apos;s supposed to
                                                    do and what kind of answers
                                                    it should give. It also
                                                    tells users what the bot can
                                                    help with, giving them an
                                                    idea of what to expect.
                                                </FormDescription>
                                            </FormItem>
                                        )}
                                    />
                                    <div className="mt-10">
                                        <FormLabel
                                            className={
                                                "text-lg " +
                                                (submitAttempted.current &&
                                                trainingDataErrors.length
                                                    ? "text-destructive"
                                                    : "")
                                            }
                                        >
                                            Training Data
                                        </FormLabel>
                                        <div className="w-[60%] mt-1.5">
                                            {trainingDataInputs.map(
                                                (tdi, idx) => {
                                                    if (
                                                        tdi.type ==
                                                        constants
                                                            .TrainingAssetTypes
                                                            .Files
                                                    ) {
                                                        return (
                                                            <div key={idx}>
                                                                <div>
                                                                    <TrainingFilesInputV2
                                                                        isDisabled={
                                                                            isRequestProcessing
                                                                        }
                                                                        state={
                                                                            tdi.value
                                                                        }
                                                                        onUpdate={(
                                                                            ftd
                                                                        ) => {
                                                                            const newState =
                                                                                new TrainingFilesInputConfigV2();
                                                                            newState.setValue(
                                                                                ftd
                                                                            );
                                                                            trainingDataInputs[
                                                                                idx
                                                                            ] =
                                                                                newState;
                                                                            setTrainingDataInputs(
                                                                                [
                                                                                    ...trainingDataInputs,
                                                                                ]
                                                                            );
                                                                            validateTrainingInputs();
                                                                        }}
                                                                    />
                                                                </div>
                                                                <TrainingErrors
                                                                    errors={
                                                                        trainingDataErrors[
                                                                            idx
                                                                        ]
                                                                    }
                                                                />
                                                            </div>
                                                        );
                                                    }
                                                }
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </Form>
            ) : (
                <SuccessBanner />
            )}
        </>
    );
}

function TrainingErrors({ errors }: { errors: string[] }) {
    return (
        <div className="ml-5 mt-1.5">
            <ul className="list-disc marker:text-red-500">
                {!!errors &&
                    errors.map((error, idx) => (
                        <li key={idx}>
                            <p className="text-destructive text-md">{error}</p>
                        </li>
                    ))}
            </ul>
        </div>
    );
}

function SuccessBanner() {
    return (
        <div>
            <h1 className="text-7xl my-5">Success!</h1>
            <div className="my-10">
                <p className="w-[30%]">
                    Your bot is being created, it will be ready
                    in some time as we are training on your data. We will inform
                    you once its ready
                </p>
            </div>
            <div className="my-10">
                <Link href={"/dashboard/bots"}>
                    <Button buttonText="Go to dashboard"></Button>
                </Link>
            </div>
        </div>
    );
}