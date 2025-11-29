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
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    isAuthenticated: false,
    login: async () => { },
    signup: async () => { },
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

    const logout = () => {
        pb.authStore.clear();
        router.push("/login");
        router.refresh();
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
