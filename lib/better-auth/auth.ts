import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import clientPromise from "@/lib/db";

const client = await clientPromise;
const db = client.db();

export const auth = betterAuth({
    debug: true,
    database: mongodbAdapter(db, {
        client,
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    user: {
        additionalFields: {
            credits: {
                type: "number",
                defaultValue: 50,
                required: false,
            },
            bio: {
                type: "string",
                defaultValue: "",
                required: false,
            },
            role: {
                type: "string",
                defaultValue: "",
                required: false,
            },
            age: {
                type: "number",
                required: false,
                defaultValue: 0,
            },
            country: {
                type: "string",
                required: false,
                defaultValue: ""
            },
            jobTitle: {
                type: "string",
                required: false,
                defaultValue: ""
            },
            twitter: { type: "string", required: false, defaultValue: "" },
            github: { type: "string", required: false, defaultValue: "" },
            linkedin: { type: "string", required: false, defaultValue: "" },
            website: { type: "string", required: false, defaultValue: "" },
        },
    },
    plugins: [
        nextCookies(),
    ]
});