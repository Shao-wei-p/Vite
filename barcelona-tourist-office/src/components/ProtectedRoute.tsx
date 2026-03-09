import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Role } from '../types';

interface ProtectedRouteProps {
    allowedRoles: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const { user, isAuthenticated } = useAuthStore();

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>Acceso Denegado: Permisos insuficientes.</div>;
    }

    return <Outlet />;
};

export default ProtectedRoute;
