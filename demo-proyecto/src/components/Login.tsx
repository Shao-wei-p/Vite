import React, { useState } from 'react';
import './AuthForms.css';

interface LoginProps {
  onLogin: (role: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState('superAdmin');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(role);
  };

  return (
    // CAMBIO: Se agregan estilos inline para forzar el centrado y pantalla completa (100vh)
    <div className="auth-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        width: '100vw',
        backgroundColor: '#f3f4f6' // Color de fondo por si falta en CSS
    }}>
      <form className="auth-form" onSubmit={handleSubmit} style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '8px', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          maxWidth: '400px',
          width: '100%'
      }}>
      <h1 className="auth-title" style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#111827' }}>Iniciar Sesión</h1>
        
        <div  className="form-group" style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151' }}>Rol para Demo:</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
          >
            <option value="superAdmin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        <button 
            type="submit" 
            className="btn-primary full-width" 
            style={{ 
                width: '100%', 
                padding: '0.75rem', 
                backgroundColor: '#2563eb', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: '1rem'
            }}
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
