import { betterAuth } from "better-auth";
import { client, db } from "../db";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";

export const auth = betterAuth({
    //...
    database: mongodbAdapter(db, {
        client
    }),
    emailAndPassword: {
        enabled: true,

    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    plugins: [
        nextCookies(),
        emailOTP({
            sendVerificationOTP: async ({ email, otp }) => {
                console.log("sendVerificationOTP", email, otp);
            },
            // sendResetPasswordOTP: async ({ email, otp }) => {
            //     console.log("sendResetPasswordOTP", email, otp);
            // },
        })
    ]
});