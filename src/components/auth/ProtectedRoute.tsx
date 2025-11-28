"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuth from "@/hooks/useAuth";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { auth } = useAuth(); // Access authentication state
  const router = useRouter();

  useEffect(() => {
    // Redirect if no access token
    if (!auth?.access) {
      router.push("/login");
    }
  }, [auth, router]);

  return auth?.isAuthenticated ? children : null;
};

export default ProtectedRoute;
