import { useContext, useDebugValue } from "react";
import AuthContext from "@/contexts/auth-context";

const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    useDebugValue(context.isAuthenticated ? "Logged In" : "Logged Out");

    return context;
}

export default useAuth;
