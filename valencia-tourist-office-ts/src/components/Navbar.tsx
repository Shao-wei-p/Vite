import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export const Navbar: React.FC = () => {
  const { user, logout, hasPermission } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-brand">Valencia Tour</div>
      
      <ul className="nav-links">
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/activities">Actividades</NavLink></li>
        <li><NavLink to="/events">Eventos</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
        <li><NavLink to="/location">Ubicación</NavLink></li>
        <li><NavLink to="/contact">Contacto</NavLink></li>
      </ul>

      <div className="nav-auth">
        {user ? (
          <div className="user-info">
            <span style={{ fontSize: '0.9rem', marginRight: '10px' }}>Hola, {user.username} ({user.role})</span>
            {hasPermission('registered') && <NavLink to="/profile" className="dash-link">Perfil</NavLink>}
            {hasPermission('worker') && <NavLink to="/manage" className="dash-link">Gestión</NavLink>}
            {hasPermission('admin') && <NavLink to="/admin" className="dash-link">Admin</NavLink>}
            <button onClick={logout} className="btn-logout">Salir</button>
          </div>
        ) : (
           <NavLink to="/login" className="login-link">Iniciar Sesión</NavLink>
        )}
      </div>
    </nav>
  );
};
