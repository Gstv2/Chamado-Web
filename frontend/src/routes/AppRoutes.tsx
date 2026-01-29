import { Routes, Route, Navigate } from 'react-router-dom';
import type { JSX } from 'react';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Dashboard } from '../pages/Dashboard';
import { CreateChamado } from '../pages/CreateChamado';
import { AdminChamados } from '../pages/AdminChamados';
import { useAuth } from '../contexts/AuthContext';

function PrivateRoute({ children }: { children: JSX.Element }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
}

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/chamados/new" element={<PrivateRoute><CreateChamado /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><AdminChamados /></PrivateRoute>} />
        </Routes>
    );
}
