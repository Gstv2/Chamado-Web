import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api';
import type { User, AuthResponse } from '../types';

// Interface que define o formato do contexto de autenticação
interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

// Criação do Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider: Componente que envolve a aplicação e fornece o estado de autenticação
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Efeito para restaurar a sessão ao recarregar a página
    // Verifica se existem dados salvos no localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token && storedUser !== 'undefined') {
            try {
                setUser(JSON.parse(storedUser));
                // Restaura o token no header padrão do axios
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

    // Função de Login
    const login = async (email: string, pass: string) => {
        try {
            const response = await api.post<AuthResponse>('/users/login', { email, senha: pass });
            const { user: apiUser, token } = response.data;

            // Salva dados no LocalStorage para persistência
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(apiUser));

            setUser(apiUser);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    // Função de Logout
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

// Hook personalizado para facilitar o uso do contexto
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
