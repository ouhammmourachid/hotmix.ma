"use client";
import React, { createContext, useState } from "react";

interface AuthContextType {
    auth: {
      username: string;
      access: string;
      isAuthenticated: boolean;
    } | null;
    setAuth: (auth: any) => void;
  }


const AuthContext = createContext<AuthContextType>({
    auth: null,
    setAuth: () => {},
});

export const AuthProvider = ({ children }:{children :React.ReactElement}) => {
    const [auth, setAuth] = useState<AuthContextType['auth']>(null);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
