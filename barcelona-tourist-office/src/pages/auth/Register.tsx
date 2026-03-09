import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MockDB } from '../../services/mockDatabase';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await MockDB.registerUser(formData.username, formData.email, formData.password);
            alert("Usuario registrado correctamente. Ahora aparecerá en el panel Admin.");
            navigate('/login');
        } catch (err: any) {
            setError(err.message || 'Error al registrar');
        }
    };

    return (
        <div className="flex justify-center p-8">
            <form onSubmit={handleSubmit} style={{ maxWidth: '400px', width: '100%', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
                <h2 className="text-2xl font-bold mb-6 text-center">Crear Cuenta</h2>
                {error && <p style={{color: 'red', marginBottom: '1rem'}}>{error}</p>}
                
                <input 
                    type="text" placeholder="Usuario" style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }} required 
                    onChange={e => setFormData({...formData, username: e.target.value})}
                />
                <input 
                    type="email" placeholder="Email" style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }} required 
                    onChange={e => setFormData({...formData, email: e.target.value})}
                />
                <input 
                    type="password" placeholder="Contraseña" style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }} required 
                    onChange={e => setFormData({...formData, password: e.target.value})}
                />
                <button type="submit" style={{ width: '100%', background: 'green', color: 'white', padding: '0.5rem' }}>Registrarse</button>
                <div className="mt-4 text-center"><Link to="/login" style={{color: 'blue'}}>¿Ya tienes cuenta? Login</Link></div>
            </form>
        </div>
    );
};

export default Register;
