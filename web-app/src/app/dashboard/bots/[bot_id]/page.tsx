"use client";

import { Button, ButtonVariants } from "@/app/shared/components/buttons";
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

const formSchema = z.object({
    botname: z.string().min(10).max(50),
    bot_description: z.string().min(50),
});

export default function BotDescription({
    params,
}: {
    params: { bot_id: string };
}) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            botname: "",
            bot_description: "",
        },
    });

    return (
        <div>
            <HeadingWithSideActionButton heading={"Bot name!"}>
                <Button
                    variant={ButtonVariants.Danger}
                    buttonText="Delete bot"
                ></Button>
            </HeadingWithSideActionButton>
            <div>
                <div className="w-[50%]">
                    <Form {...form}>
                        <form>
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
                                        <FormDescription className="border-1 bg-yellow-100 rounded-md p-4">
                                            This is your public bot name.
                                        </FormDescription>
                                        <FormMessage />
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
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
