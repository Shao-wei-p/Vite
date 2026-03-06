import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (role) => {
        login(role);
        if (role === 'registered') navigate('/dashboard');
        else if (role === 'worker') navigate('/management');
        else if (role === 'admin') navigate('/admin');
        else navigate('/');
    };

    return (
        <div className="min-h-[calc(100vh-100px)] flex items-center justify-center bg-gray-50 px-4">
            <div className="form-container max-w-sm">
                <div className="text-center mb-6">
                    <span className="text-6xl">🍊</span>
                    <h2 className="text-2xl font-bold mt-4 text-orange-600">Turismo Valencia</h2>
                    <p className="text-sm text-gray-500">Selecciona un perfil educativo:</p>
                </div>
                
                <div className="space-y-3">
                    <button onClick={() => handleLogin('registered')} className="btn-role bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                        <span className="text-xl">👤</span> Turista Registrado
                    </button>
                    <button onClick={() => handleLogin('worker')} className="btn-role bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                        <span className="text-xl">💼</span> Trabajador
                    </button>
                    <button onClick={() => handleLogin('admin')} className="btn-role bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200">
                        <span className="text-xl">🛡️</span> Administrador
                    </button>
                    
                    <div className="border-t pt-4 mt-4">
                        <button onClick={() => handleLogin('visitor')} className="btn-role bg-gray-50 text-gray-600 hover:bg-gray-100 justify-center text-sm">
                            Continuar como Visitante
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
