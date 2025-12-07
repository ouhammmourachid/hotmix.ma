"use client";
import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";

import { Skeleton } from "@/components/ui/skeleton";
import pb from "@/lib/pocketbase";

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
  const { isAuthenticated, logout } = useAuth();


  useEffect(() => {
    const verifyUser = async () => {
      try {
        if (pb.authStore.isValid) {
          await pb.collection('users').authRefresh();
        }
        setIsLoading(false);
      } catch (err: any) {
        // Ignore auto-cancellation errors
        if (err.isAbort) {
          return;
        }
        console.error("Auth refresh failed:", err);
        // Token invalid
        logout();
      }
    };

    if (!pb.authStore.isValid) {
      // If not authenticated, redirect to login
      window.location.replace('/login');
    } else {
      verifyUser();
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
