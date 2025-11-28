// components/LogoutButton.tsx
"use client";
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import axios from '@/api/axios';
import { LogOut } from 'lucide-react';
import { useTranslation } from '@/lib/i18n-utils';

const LogoutButton = () => {
    const { setAuth } = useAuth();
    const router = useRouter();
    const { t } = useTranslation();

    const handleLogout = async () => {
        try {
            // Send request to backend to invalidate refresh token
            await axios.post('/logout/', {}, {
                withCredentials: true
            });

            // Clear auth state
            setAuth({});

            // Redirect to login page
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            // Still clear auth state and redirect even if server request fails
            setAuth({});
            router.push('/login');
        }
    };

    return (
        <button
            className="flex flex-row items-center space-x-2 text-red-500"
            onClick={handleLogout}>
            <LogOut size={18}/>
            <p>{t('nav_logout')}</p>
        </button>
    );
};

export default LogoutButton;
