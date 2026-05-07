import { NextAuthOptions } from "next-auth";

export const authConfig: NextAuthOptions = {
    providers: [],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async session({ session }) {
            return session;
        },
    },
} satisfies NextAuthOptions;