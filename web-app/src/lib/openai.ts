import OpenAI from "openai";

export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateBotSystemPrompt(botDescription: string) {
    const result = await openai.chat.completions.create({
        temperature: 0,
        top_p: 0.5,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
        model: "gpt-4",
        max_tokens: 300,
        messages: [
            {
                role: "user",
                content: `"you are an Andrew Huberman assistant who can read Andrew Huberman podcast notes, always answer the query using the provided context information and not prior knowledge, Some rules to follow: 1. Never directly reference the given context in your answer. 2 Avoid statements like 'Based on the context, ..'   or 'The context information ...' or anything along those lines. ".The above paragraph is a system for a chatbot which answers questions asked by users, taking it as an example, generate a system prompt of a bot having the description "${botDescription}". The system prompt should instruct the bot to be concise and to the point.`,
            },
        ],
    });
    return result.choices[0].message.content;
}
