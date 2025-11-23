import { authClient } from "@/lib/better-auth/auth-client";

export const useUser = () => {
  const { 
    data: session, 
    isPending,
    error      
  } = authClient.useSession();

  return {
    user: session?.user || null,
    session: session,
    isLoading: isPending,
    isAuthenticated: !!session?.user,
    error
  };
};