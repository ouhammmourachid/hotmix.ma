"use client";
import React, { createContext, useState, useEffect } from "react";
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
                email: data.email
            });
            // Optionally login after signup
            await login({ email: data.email, password: data.password });
        } catch (error: any) {
            throw error;
        }
    };

    // Helper function to generate a cryptographically strong random password
    const generateStrongPassword = (): string => {
        const length = 32;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
        let password = "";

        // Use crypto.getRandomValues for cryptographically secure random numbers
        const randomValues = new Uint32Array(length);
        crypto.getRandomValues(randomValues);

        for (let i = 0; i < length; i++) {
            password += charset[randomValues[i] % charset.length];
        }

        return password;
    };

    const requestOtp = async (email: string) => {
        console.log("requestOtp called for:", email);

        // 1. Try to create the user if they don't exist
        try {
            // Generate username from email (e.g., rachidouhammou21@gmail.com -> rachidouhammou21)
            const username = email.split('@')[0];

            // Generate a random strong password (user won't need it, they'll use OTP)
            const randomPassword = generateStrongPassword();

            await pb.collection("users").create({
                email,
                username,
                password: randomPassword,
                passwordConfirm: randomPassword,
                emailVisibility: true,
            });
            console.log("New user created successfully");
        } catch (err: any) {
            // User likely already exists, which is fine
            console.log("User already exists, proceeding with OTP request");
        }

        // 2. Request OTP (works for both new and existing users)
        try {
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
