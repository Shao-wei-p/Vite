import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore'; // Store global
import { MockDB } from '../../services/mockDatabase';

const Login: React.FC = () => {
    const navigate = useNavigate();
    // Selector de Zustand: Extraemos solo la función 'login' para no re-renderizar si cambia 'user'.
    const login = useAuthStore(s => s.login);
    
    // Estados locales para los campos del formulario
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // 1. Verificación contra la BD (Server State)
        const foundUser = await MockDB.loginUser(email);

        if (foundUser) {
            // 2. Si existe, actualizamos el estado global (Client State)
            // Esto dispara la persistencia en localStorage automáticamente gracias al middleware.
            login(foundUser);
            
            // 3. Redirección basada en Rol (Lógica de Negocio)
            if (foundUser.role === 'admin') navigate('/admin-settings');
            else if (foundUser.role === 'worker') navigate('/worker-tools');
            else navigate('/panel');
        } else {
            setError("Usuario no encontrado. Regístrate o usa los demos.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
            <form onSubmit={handleLogin} style={{ maxWidth: '400px', width: '100%', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
                <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
                {/* Renderizado condicional del error */}
                {error && <p style={{color: 'red', marginBottom: '1rem'}}>{error}</p>}
                
                <div className="mb-4">
                    <label className="block mb-2">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded" required />
                </div>
                <div className="mb-6">
                    <label className="block mb-2">Contraseña</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border rounded" required />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Entrar</button>
                <div className="mt-4 text-center text-sm">
                    <p>Roles demo: <strong>worker@bcn.cat</strong>, <strong>admin@bcn.cat</strong></p>
                    <Link to="/register" style={{color: 'blue'}}>Registrarse (Nuevo Usuario)</Link>
                </div>
            </form>
        </div>
    );
}; 

export default Login;
