import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const { sendMessage } = useData();
    const { user } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage({ 
            text: formData.message, 
            from: user ? user.username : formData.email || "Anonimo" 
        });
        alert("Mensaje enviado a la oficina.");
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 bg-orange-50">
            <div className="form-container">
                <h1 className="text-3xl mb-2 text-center text-orange-600">Contáctanos</h1>
                <p className="text-center mb-6 text-sm">¿Tienes dudas? Te respondemos rápido.</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Nombre</label>
                        <input 
                            type="text" required 
                            className="input-field"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Email</label>
                        <input 
                            type="email" required 
                            className="input-field"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Mensaje</label>
                        <textarea 
                            required rows="4"
                            className="input-field resize-none"
                            value={formData.message}
                            onChange={e => setFormData({...formData, message: e.target.value})}
                        />
                    </div>
                    <button type="submit" className="btn-primary w-full py-3 mt-2">
                        Enviar Mensaje
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
