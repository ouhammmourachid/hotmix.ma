// components/LogoutButton.tsx
"use client";
import useAuth from '@/hooks/useAuth';
import { LogOut } from 'lucide-react';
import { useTranslation } from '@/lib/i18n-utils';

const LogoutButton = () => {
    const { logout } = useAuth();
    const { t } = useTranslation();

    const handleLogout = () => {
        logout();
    };

    return (
        <button
            className="flex flex-row items-center space-x-2 text-red-500"
            onClick={handleLogout}>
            <LogOut size={18} />
            <p>{t('nav_logout')}</p>
        </button>
    );
};

export default LogoutButton;
