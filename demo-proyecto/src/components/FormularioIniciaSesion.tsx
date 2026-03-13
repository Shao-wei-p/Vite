import React, { useState } from 'react';
import './AuthForms.css';

interface LoginProps {
  onSubmit: (email: string, pass: string) => Promise<void> | void;
  error?: string; // Prop para mostrar errores desde el padre
}

const FormularioIniciaSesion: React.FC<LoginProps> = ({ onSubmit, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Estado local de carga

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(email, password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="auth-title">Iniciar Sesión</h1>
        
        {/* Mostramos el error si existe */}
        {error && (
            <div className="form-error" role="alert">
                {error}
            </div>
        )}

        <div className="form-group">
          <label htmlFor="login-email">Correo Electrónico</label>
          <input
            id="login-email"
            type="email"
            placeholder="admin@demo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-pass">Contraseña</label>
          <input
            id="login-pass"
            type="password"
            placeholder="123"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
            disabled={loading}
          />
        </div>

        <button 
            type="submit" 
            className="btn-primary full-width"
            disabled={loading} // Evita dobles envíos
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default FormularioIniciaSesion;
