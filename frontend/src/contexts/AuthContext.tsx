import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api';
import type { User, AuthResponse } from '../types';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token && storedUser !== 'undefined') {
            try {
                setUser(JSON.parse(storedUser));
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } catch (error) {
                console.error('Erro ao restaurar sessão:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        } else {
             // Limpa dados inválidos caso existam
             if (storedUser === 'undefined') {
                 localStorage.removeItem('user');
             }
        }
        setLoading(false);
    }, []);

    const login = async (email: string, pass: string) => {
        try {
            const response = await api.post<AuthResponse>('/users/login', { email, senha: pass });
            const { user: apiUser, token } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(apiUser));

            setUser(apiUser);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
