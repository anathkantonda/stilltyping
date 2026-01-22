import { betterAuth } from "better-auth";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    user: {
        additionalFields: {
            username: {
                type: 'string',
                required: false,
                unique: true,
            },
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    plugins: [tanstackStartCookies()]
});