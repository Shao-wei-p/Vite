import React, { useState } from 'react';
import { useData } from '../context/DataContext';

// Home: Hero Section
export const Home: React.FC = () => (
  <div className="hero-section">
    <div className="hero-content">
      <h1>Bienvinguts a València</h1>
      <p>Descubre la luz, el fuego y la pasión del Mediterráneo.</p>
    </div>
  </div>
);

// About: Historia
export const About: React.FC = () => (
  <div className="page-container">
    <h2>Sobre Nosotros</h2>
    <p>Desde 1990 promoviendo el turismo cultural y sostenible en la capital del Turia.</p>
  </div>
);

// Location: Map Placeholder
export const Location: React.FC = () => (
  <div className="page-container">
    <h2>Nuestra Ubicación</h2>
    <p>Plaza del Ayuntamiento, 1, València.</p>
    <div style={{ background: '#ddd', height: '400px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <span style={{ color: '#666', fontSize: '1.5rem' }}>Google Maps Placeholder (Iframe)</span>
    </div>
  </div>
);

// Contact: Formulario
export const Contact: React.FC = () => {
  const { addMessage } = useData();
  const [form, setForm] = useState({ email: '', content: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMessage({
        id: Date.now(),
        email: form.email,
        content: form.content,
        isRead: false,
        date: new Date().toISOString()
    });
    alert('Mensaje enviado correctamente');
    setForm({ email: '', content: '' });
  };

  return (
    <div className="page-container">
        <h2>Contacto</h2>
        <form onSubmit={handleSubmit} className="contact-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px', margin: '0 auto' }}>
            <input 
                type="email" placeholder="Tu Email" required 
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})}
                style={{ pad: '10px' }}
            />
            <textarea 
                placeholder="¿En qué podemos ayudarte?" required rows={5}
                value={form.content}
                onChange={e => setForm({...form, content: e.target.value})}
            />
            <button type="submit" style={{ padding: '10px', background: '#E27D60', color: 'white', border: 'none' }}>Enviar Mensaje</button>
        </form>
    </div>
  );
};
