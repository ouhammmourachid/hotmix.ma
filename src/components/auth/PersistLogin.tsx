"use client";
import { useState, useEffect } from "react";
import useRefreshToken from "@/hooks/useRefreshToken";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import {Skeleton} from "@/components/ui/skeleton";


const AuthLoading = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="space-y-4 w-full max-w-md p-4">
        {/* Simulate a content layout while loading */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-24 w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
};

const PersistLogin = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth} = useAuth();
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
        try {
            await refresh();
        } catch (err) {
            // Redirect to login if refresh fails
            router.push('/login');
        } finally {
            isMounted && setIsLoading(false);
        }
    }

    // Only verify if we don't have a valid access token
    !auth?.access ? verifyRefreshToken() : setIsLoading(false);

    return () => {
        isMounted = false;
    }
  }, []);

  return (
    <>
      {isLoading
        ? <AuthLoading />
        : children
      }
    </>
  );
};

export default PersistLogin;
