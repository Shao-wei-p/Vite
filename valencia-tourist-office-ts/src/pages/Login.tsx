import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

export const Login: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (role: UserRole) => {
        login(role);
        // Redirección simple basada en rol
        if (role === 'admin') navigate('/admin');
        else if (role === 'worker') navigate('/manage');
        else if (role === 'registered') navigate('/profile');
        else navigate('/');
    };

    return (
        <div className="page-container" style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Iniciar Sesión (Simulación)</h2>
            <p>Selecciona un rol para probar las funcionalidades del sistema:</p>
            
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
                <button onClick={() => handleLogin('visitor')} className="login-btn visitor">Soy Visitante</button>
                <button onClick={() => handleLogin('registered')} className="login-btn user">Soy Usuario</button>
                <button onClick={() => handleLogin('worker')} className="login-btn worker">Soy Trabajador</button>
                <button onClick={() => handleLogin('admin')} className="login-btn admin">Soy Admin</button>
            </div>
        </div>
    );
};
