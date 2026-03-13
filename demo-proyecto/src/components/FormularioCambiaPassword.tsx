import React, { useState } from 'react';
import './AuthForms.css';

interface ChangePassProps {
  onSubmit: (oldPass: string, newPass: string) => void;
}

const FormularioCambiaPassword: React.FC<ChangePassProps> = ({ onSubmit }) => {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }
    onSubmit(oldPass, newPass);
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="auth-title">Cambiar Contraseña</h1>
        
        {error && <div className="form-error" role="alert">{error}</div>}

        <div className="form-group">
          <label htmlFor="old-pass">Contraseña Actual</label>
          <input
            id="old-pass"
            type="password"
            placeholder="Contraseña actual"
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="new-pass">Nueva Contraseña</label>
          <input
            id="new-pass"
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            required
            minLength={8}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirm-pass">Confirmar Nueva Contraseña</label>
          <input
            id="confirm-pass"
            type="password"
            placeholder="Repite la contraseña"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <button type="submit" className="btn-primary full-width">
          Actualizar Contraseña
        </button>
      </form>
    </div>
  );
};

export default FormularioCambiaPassword;
