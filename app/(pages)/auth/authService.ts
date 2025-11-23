'use server'
import { authClient } from "@/lib/better-auth/auth-client";
import { redirect } from "next/navigation";

import { headers } from "next/headers";
import { auth } from "@/lib/better-auth/auth";

export const userProfile = async () => {
    const userSession = await auth.api.getSession({
        headers: await headers(),
    });
    return userSession;
};

export const handleUserSignIn = async (email: string, password: string) => {
    const { data, error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
    }, {
        onRequest: (ctx) => {
            //show loading
        },
        onSuccess: (ctx) => {
            //redirect to the dashboard or sign in page
            redirect("/");
        },
        onError: (ctx) => {
            // display the error message
            alert(ctx.error.message);
        },
    });

    return { data, error };
}

export const handleGoogleAuth = async () => {
    const { data, error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        errorCallbackURL: "/error",
        // newUserCallbackURL: "/welcome",
    });

    return { data, error };
}

export const handleSignOut = async () => {
    
}