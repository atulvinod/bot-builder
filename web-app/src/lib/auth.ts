import GoogleProvider from "next-auth/providers/google";
import NextAuth, { getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import * as jwt from "jsonwebtoken";
import { createUser, getUserByEmail } from "./services/user";

export const authConfig = {
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
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            let dbUser: {
                id?: number;
                name: string;
                email: string;
                image?: string | null;
            } = await getUserByEmail(user.email!!);
            if (!dbUser) {
                dbUser = await createUser(
                    user.name!!,
                    user.email!!,
                    user.image
                );
            }
            user.id = dbUser.id;
            return true;
        },
        async jwt({ token, account, profile, user }) {
            if (account) {
                token.accessToken = account.access_token;
                token.id = user.id;
                token.jwt = jwt.sign(
                    {
                        id: user.id,
                        email: token.email,
                        iat: profile.iat,
                    },
                    process.env.NEXTAUTH_SECRET!!,
                    {
                        expiresIn: "1y",
                    }
                );
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.jwt = token.jwt;
            session.user.id = token.id;
            return session;
        },
    },
} satisfies NextAuthOptions;

export const handlers = NextAuth(authConfig);

export const getUser = async () => getServerSession(authConfig);