import PersistLogin from "@/components/auth/PersistLogin";


export default function AccountLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <PersistLogin>
            {children}
        </PersistLogin>
    );
}
