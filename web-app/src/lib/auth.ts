import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";

const config = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!!,
        }),
    ],
    debug: true,
    session: {
        strategy: "jwt",
    },
} satisfies NextAuthOptions;

export const handlers =  NextAuth(config);;
