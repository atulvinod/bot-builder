import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";

const config = {
    providers: [
        GoogleProvider({
            clientId:
                "533837367798-e4c2nun12lje744k7nfb12dt7a9q24r9.apps.googleusercontent.com",
            clientSecret: "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",
        }),
    ],
    debug: true,
    session: {
        strategy: "jwt",
    },
} satisfies NextAuthOptions;

export const handlers =  NextAuth(config);;
