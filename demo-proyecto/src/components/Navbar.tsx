import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  userRole: string;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ userRole, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    // CAMBIO IMPORTANTE: Estilos para barra lateral vertical
    <nav style={{ 
      width: '250px', 
      height: '100vh', 
      backgroundColor: '#1f2937', 
      color: 'white',
      display: 'flex', 
      flexDirection: 'column', 
      padding: '1.5rem',
      flexShrink: 0
    }}>
      <div className="brand" style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
        Demo App
      </div>
      
      <div className="menu" style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        {/* Estilos comunes para links */}
        <style>{`
          .nav-link { color: #d1d5db; text-decoration: none; padding: 10px; border-radius: 6px; display: block; }
          .nav-link:hover { background-color: #374151; color: white; }
        `}</style>

        {userRole !== 'viewer' && <Link className="nav-link" to="/app">Inicio</Link>}
        
        {['superAdmin', 'admin', 'editor'].includes(userRole) && (
          <Link className="nav-link" to="/proyectos">Proyectos</Link>
        )}

        <Link className="nav-link" to="/informes">Informes</Link>

        {['superAdmin', 'admin'].includes(userRole) && (
          <Link className="nav-link" to="/usuarios">Usuarios</Link>
        )}
      </div>

      <div className="user-actions" style={{ borderTop: '1px solid #374151', paddingTop: '1rem' }}>
        <div style={{ marginBottom: '10px', fontSize: '0.9em', color: '#9ca3af' }}>
          Rol: <span style={{ color: 'white', textTransform: 'capitalize' }}>{userRole}</span>
        </div>
        <button 
          onClick={handleLogout}
          style={{ 
            width: '100%', 
            padding: '8px', 
            backgroundColor: '#dc2626', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
