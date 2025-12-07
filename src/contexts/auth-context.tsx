"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import pb from "@/lib/pocketbase";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: any;
    token: string | null;
    isAuthenticated: boolean;
    login: (data: any) => Promise<void>;
    signup: (data: any) => Promise<void>;
    requestOtp: (email: string) => Promise<{ success: boolean; otpId?: string }>;
    verifyOtp: (otpId: string, code: string) => Promise<any>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    isAuthenticated: false,
    login: async () => { },
    signup: async () => { },
    requestOtp: async () => { return { success: false } },
    verifyOtp: async () => { },
    logout: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactElement }) => {
    const [user, setUser] = useState<any>(pb.authStore.model);
    const [token, setToken] = useState<string | null>(pb.authStore.token);
    const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = pb.authStore.onChange((token, model) => {
            setToken(token);
            setUser(model);
            setIsAuthenticated(pb.authStore.isValid);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const login = async (data: any) => {
        try {
            await pb.collection("users").authWithPassword(data.email, data.password);
            router.push("/account");
            router.refresh();
        } catch (error: any) {
            throw error;
        }
    };

    const signup = async (data: any) => {
        try {
            await pb.collection("users").create({
                email: data.email,
                password: data.password,
                passwordConfirm: data.confirmPassword,
                name: data.username || data.email.split('@')[0],
            });
            // Optionally login after signup
            await login({ email: data.email, password: data.password });
        } catch (error: any) {
            throw error;
        }
    };

    const requestOtp = async (email: string) => {
        console.log("requestOtp called for:", email);

        // 1. Attempt to create the user first
        try {
            await pb.collection("users").create({
                email,
                password: "Password123!",
                passwordConfirm: "Password123!",
                emailVisibility: true,
            });
            console.log("User created successfully (new account).");
        } catch (err: any) {
            console.log("User creation skipped (likely exists):", err.message);
        }

        // 2. Request OTP
        try {
            console.log("Attempting to request OTP...");
            const response = await pb.collection("users").requestOTP(email);
            console.log("OTP requested successfully:", response);
            return { success: true, otpId: response.otpId };
        } catch (err: any) {
            console.error("requestOTP failed:", err);
            throw err;
        }
    };

    const verifyOtp = async (otpId: string, code: string) => {
        try {
            // authenticate with the requested OTP id and the email password
            const authData = await pb.collection('users').authWithOTP(
                otpId,
                code,
            );

            // Update state immediately (though the subscription should handle it too)
            setToken(pb.authStore.token);
            setUser(pb.authStore.model);
            setIsAuthenticated(pb.authStore.isValid);

            router.push("/account");
            router.refresh();
            return authData;
        } catch (error: any) {
            throw error;
        }
    };

    const logout = () => {
        pb.authStore.clear();
        router.push("/login");
        router.refresh();
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, login, signup, requestOtp, verifyOtp, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
