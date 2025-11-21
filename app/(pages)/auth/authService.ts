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



const handleUserSignUp = async (name: string, email: string, password: string) => {
    const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/dashboard",
    }, {
        onRequest: (ctx) => {
            //show loading
        },
        onSuccess: (ctx) => {
            //redirect to the dashboard or sign in page
            redirect("/dashboard");
        },
        onError: (ctx) => {
            // display the error message
            alert(ctx.error.message);
        },
    });

    return { data, error };
}

const handleUserSignIn = async (email: string, password: string) => {
    const { data, error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
    }, {
        onRequest: (ctx) => {
            //show loading
        },
        onSuccess: (ctx) => {
            //redirect to the dashboard or sign in page
            redirect("/dashboard");
        },
        onError: (ctx) => {
            // display the error message
            alert(ctx.error.message);
        },
    });

    return { data, error };
}

const handleGoogleAuth = async () => {
    const { data, error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
        errorCallbackURL: "/error",
        // newUserCallbackURL: "/welcome",
        disableRedirect: true,
    });

    return { data, error };
}

const handleSignOut = async () => {
    const { data, error } = await authClient.signOut({
        fetchOptions: {
            onSuccess: () => {
                redirect("/login");
            },
        },
    });

    return { data, error };
}