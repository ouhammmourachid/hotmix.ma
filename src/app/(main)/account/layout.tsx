import PersistLogin from "@/components/auth/PersistLogin";
import {AuthProvider}  from "@/contexts/auth-context";


export default function AccountLayout({ children }: Readonly<{ children: React.ReactNode}>) {
    return (
        <AuthProvider>
            <PersistLogin>
                {children}
            </PersistLogin>
        </AuthProvider>
    );
}
