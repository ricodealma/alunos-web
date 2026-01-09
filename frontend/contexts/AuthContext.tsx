'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import api from '@/services/api';
import type { User, LoginRequest } from '@/types';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        if (typeof window === 'undefined') return null;

        const token = localStorage.getItem('authToken');
        const email = localStorage.getItem('userEmail');
        return token && email ? { email, token } : null;
    });

    const login = async (email: string, password: string) => {
        const loginData: LoginRequest = { email, password };

        const response = await api.post('/auth/login', loginData);
        const { token, email: userEmail } = response.data;

        // Store in localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('userEmail', userEmail);

        // Update state
        setUser({ email: userEmail, token });
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading: false, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
