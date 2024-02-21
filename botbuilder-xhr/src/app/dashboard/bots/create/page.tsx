"use client";

import { v4 as uuidv4 } from "uuid";
import {
    Button as AppButton,
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
import FileTrainingDataInput from "@/app/shared/components/file_training_data_input";
import { useRef, useState } from "react";
import { TrainingDataSchema } from "@/app/shared/components/interfaces";
import { TrainingFilesInputConfig } from "@/app/shared/utils";
import * as constants from "@/lib/constants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

export default function CreateBotPage({
    params,
}: {
    params: { bot_id: string };
}) {
    const router = useRouter();
    const [trainingDataErrors, setTrainingDataErrors] = useState<string[]>();
    const [isRequestProcessing, setIsRequestProcessing] =
        useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    type FormDataStruct = z.infer<typeof formSchema>;

    const [trainingDataInputState, setTrainingDataInputStates] = useState<
        TrainingDataSchema<File[]>[]
    >([new TrainingFilesInputConfig()]);

    const getTrainingData = (): {
        [key: string]: any;
    } => {
        const data = trainingDataInputState.reduce(
            (acc: { [key: string]: Object }, v) => {
                const inputType = constants.TrainingAssetTypes[v.type];
                acc[inputType] = v.value;
                return acc;
            },
            {}
        );
        return data;
    };

    const appendTrainingDataToForm = (formData: FormData) => {
        const trainingData = getTrainingData();
        const trainingDataTypes: constants.TrainingAssetTypes[] = [];
        if (
            trainingData[constants.TrainingAssetTypes.Files] &&
            trainingData[constants.TrainingAssetTypes.Files].length
        ) {
            trainingDataTypes.push(constants.TrainingAssetTypes.Files);
            trainingData[constants.TrainingAssetTypes.Files].forEach(
                (f: File) => {
                    formData.append(constants.TRAINING_DATA_FILE, f);
                }
            );
        }
        formData.set(
            constants.TRAINING_DATA_TYPES,
            JSON.stringify(trainingDataTypes)
        );
    };

    const buildFromObject = (formData: FormDataStruct) => {
        const uploadFormPayload = new FormData();
        appendTrainingDataToForm(uploadFormPayload);
        uploadFormPayload.append(constants.BOT_NAME, formData.botname);
        uploadFormPayload.append(
            constants.BOT_DESCRIPTION,
            formData.bot_description
        );
        return uploadFormPayload;
    };

    const publishBot = async (formData: FormDataStruct) => {
        validateTrainingInputs();
        const isTrainingDataValid = (trainingDataErrors ?? []).length == 0;
        if (!isTrainingDataValid) {
            return;
        }
        const uploadFormPayload = buildFromObject(formData);
        try {
            setIsRequestProcessing(true);
            const response = await fetch("/api/bot", {
                method: "POST",
                body: uploadFormPayload,
            });
            if (!response.ok) {
                toast.error(
                    "An unexpected error occurred, please try again later"
                );
            } else {
                const body = await response.json();
                router.replace(
                    `/dashboard/bots/success?bot_id=${body.data.bot_id}`
                );
            }
        } catch (e: any) {
            toast.error("An unexpected error occurred, please try again later");
        } finally {
            setIsRequestProcessing(false);
        }
    };

    const validateTrainingInputs = function () {
        const errors = trainingDataInputState.reduce((acc: string[], v) => {
            if (!v.isValid()) {
                acc.push(...v.errors);
            }
            return acc;
        }, []);
        setTrainingDataErrors(errors);
    };

    const formRef = useRef<HTMLFormElement>(null);

    //TODO: proxy handle submit to invoke file input validation
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(publishBot)} ref={formRef}>
                <div>
                    <HeadingWithSideActionButton heading={"Create new bot"}>
                        <AppButton
                            type="submit"
                            variant={
                                isRequestProcessing
                                    ? ButtonVariants.Loading
                                    : ButtonVariants.Magic
                            }
                            buttonText={
                                isRequestProcessing ? "Publishing" : "Publish"
                            }
                        ></AppButton>
                    </HeadingWithSideActionButton>
                    <div>
                        <div className="w-[50%]">
                            <FormField
                                control={form.control}
                                name="botname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg">
                                            Your Bot Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Add a bot name!"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                        <FormDescription className="border-1 bg-yellow-100 rounded-md p-4">
                                            This is your public bot name.
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bot_description"
                                render={({ field }) => (
                                    <FormItem className="mt-10">
                                        <FormLabel className="text-lg">
                                            Your bot description
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="Add a bot name!"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                        <FormDescription className="border-1 bg-yellow-100 rounded-md p-4">
                                            A bot description is like an
                                            introduction for a chatbot. It helps
                                            the chatbot know what it&apos;s
                                            supposed to do and what kind of
                                            answers it should give. It also
                                            tells users what the bot can help
                                            with, giving them an idea of what to
                                            expect.
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <div className="mt-10">
                                <FormLabel className="text-lg">
                                    Your Training Data
                                </FormLabel>
                                <div className="ml-3">
                                    {trainingDataErrors?.map((error, index) => (
                                        <span
                                            className="text-red-500 mt-2 text-sm"
                                            key={index}
                                        >
                                            {error}
                                        </span>
                                    ))}
                                </div>
                                <div className="w-[60%]">
                                    {trainingDataInputState.map(
                                        (schema, index) => {
                                            if (
                                                schema.type ==
                                                constants.TrainingAssetTypes
                                                    .Files
                                            ) {
                                                return (
                                                    <FileTrainingDataInput
                                                        key={index}
                                                        onFileChange={(
                                                            value
                                                        ) => {
                                                            schema.setValue(
                                                                value
                                                            );
                                                            validateTrainingInputs();
                                                        }}
                                                    />
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
    );
}
