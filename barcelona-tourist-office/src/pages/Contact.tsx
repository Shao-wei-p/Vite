import React, { useState } from 'react';
import { MockDB } from '../services/mockDatabase';

const Contact: React.FC = () => {
    const [sent, setSent] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Guardar mensaje en "BDD"
        await MockDB.saveMessage(formData.name, formData.email, formData.message);
        setSent(true);
    };

    if (sent) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                <h2 style={{ color: 'green' }}>¡Mensaje Enviado!</h2>
                <p>Gracias por contactarnos. Te responderemos en breve.</p>
                <button onClick={() => setSent(false)} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>Volver</button>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
            <h1 className="text-2xl font-bold mb-6 text-center">Contáctanos</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nombre</label>
                    <input 
                        type="text" required 
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} 
                        onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                    <input 
                        type="email" required 
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }} 
                        onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Mensaje</label>
                    <textarea 
                        required rows={5} 
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                </div>
                <button type="submit" style={{ background: '#000', color: '#fff', padding: '0.75rem', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '1rem' }}>
                    Enviar Mensaje
                </button>
            </form>
        </div>
    );
};

export default Contact;
