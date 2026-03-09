import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Recovery: React.FC = () => {
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <div className="flex justify-center p-8">
            <div style={{ maxWidth: '400px', width: '100%', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
                <h2 className="text-2xl font-bold mb-6 text-center">Recuperar Contraseña</h2>
                {!sent ? (
                    <form onSubmit={handleSubmit}>
                        <p className="mb-4 text-gray-600">Introduce tu email y te enviaremos instrucciones.</p>
                        <input type="email" placeholder="Email" className="w-full p-2 border rounded mb-6" required />
                        <button type="submit" className="w-full bg-gray-800 text-white p-2 rounded">Enviar enlace</button>
                    </form>
                ) : (
                    <div className="text-center text-green-600">
                        <p>Si el correo existe, recibirás instrucciones en breve.</p>
                    </div>
                )}
                <div className="mt-4 text-center"><Link to="/login" className="text-blue-600">Volver al Login</Link></div>
            </div>
        </div>
    );
};

export default Recovery;
