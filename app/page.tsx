"use client";

import { useEffect } from "react";
import Loader from "@/components/Loader";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/better-auth/auth-client";

export default function Home() {
    const { user, isLoading, isAuthenticated } = useUser();
    const router = useRouter();

    
    const {data: session} =  authClient.useSession()
    console.log('user page.tsx: ', session?.user);
    

    // 1. Handle Redirection using useEffect - MUST BE UNCONDITIONAL
    useEffect(() => {
        // Only run logic once loading is complete
        if (!isLoading) {
            if (!isAuthenticated) {
                // Redirect to login if not authenticated
                router.replace("/auth/login");
            } else if (user?.id) {
                // Redirect to dashboard if authenticated and user ID is available
                // Use router.replace to prevent back-button issues
                router.replace(`/${user.id}/dashboard`);
            }
        }
    }, [isLoading, isAuthenticated, user?.id, router]); // Dependency array includes all external values

    // 2. Handle Loading State - This is the conditional return
    if (isLoading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center space-y-4">
                <Loader />
                <span className="text-lg text-gray-700">
                    Checking authentication status...
                </span>
            </div>
        );
    }

    // 3. Return a Fallback UI - Returns while redirection is pending
    return (
        <div className="h-screen w-full flex items-center justify-center">
            <p>Redirecting...</p>
        </div>
    );
}