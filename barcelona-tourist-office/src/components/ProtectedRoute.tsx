import React from 'react';
// Navigate: Componente para redirigir al usuario a otra URL.
// Outlet: Componente especial que renderiza los componentes "hijos" de esta ruta.
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore'; // Acceso al estado global de sesión.
import { Role } from '../types';

// Definimos las props que acepta este componente.
// allowedRoles es un array de Strings (Role[]) que dice quién puede pasar.
interface ProtectedRouteProps {
    allowedRoles: Role[];
}

// React.FC<ProtectedRouteProps>: "FC" significa Functional Component.
// Le decimos a TS que este componente recibe las props definidas arriba.
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    // Zustand: Extraemos síncronamente los datos del usuario.
    const { user, isAuthenticated } = useAuthStore();

    // Lógica 1: ¿Estás logueado?
    // Si no está autenticado O user es null, lo mandamos al login.
    // replace prop: Reemplaza la entrada actual en el historial para que el botón "Atrás" no vuelva aquí.
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    // Lógica 2: ¿Tienes el rol correcto?
    // Verificamos si el rol del usuario está incluido en la lista de permitidos.
    if (!allowedRoles.includes(user.role)) {
        return <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>Acceso Denegado: Permisos insuficientes.</div>;
    }

    // Si pasa todas las verificaciones, renderiza los hijos (<Outlet />).
    // Esto permite anidar rutas dentro de este protector en App.tsx.
    return <Outlet />;
};

export default ProtectedRoute;
