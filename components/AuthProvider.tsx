'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (user: User) => void;
    logout: () => Promise<void>;
    checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const checkSession = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                // Try refresh
                const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });
                if (refreshRes.ok) {
                    const retryRes = await fetch('/api/auth/me');
                    if (retryRes.ok) {
                        const data = await retryRes.json();
                        setUser(data.user);
                    }
                } else {
                    setUser(null);
                }
            }
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkSession();
    }, []);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        router.push('/');
        router.refresh(); // Clear server component cache
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, checkSession }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
