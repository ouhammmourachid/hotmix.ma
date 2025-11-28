"use client";
import axios from '@/api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        try {
            const response = await axios.post('/token/refresh/', {}, {
                withCredentials: true // Important for sending cookies
            });

            const { access } = response.data;

            setAuth(prev => {
                return {
                    ...prev,
                    access,
                    isAuthenticated: true
                }
            });

            return access;
        } catch (error) {
            setAuth(null);
            throw error;
        }
    };
    return refresh;
};

export default useRefreshToken;
