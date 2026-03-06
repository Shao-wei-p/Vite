import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="nav-container">
      <div className="nav-content">
        <Link to="/" className="font-bold text-2xl flex items-center gap-2 text-white">
          <span className="text-3xl">🍊</span> Valencia
        </Link>
        
        <div className="hidden md:flex space-x-6 items-center">
          <NavLink to="/" className={({isActive}) => isActive ? "nav-link-active" : "nav-link"}>Inicio</NavLink>
          <NavLink to="/activities" className={({isActive}) => isActive ? "nav-link-active" : "nav-link"}>Actividades</NavLink>
          <NavLink to="/events" className={({isActive}) => isActive ? "nav-link-active" : "nav-link"}>Eventos</NavLink>
          <NavLink to="/contact" className={({isActive}) => isActive ? "nav-link-active" : "nav-link"}>Contacto</NavLink>
          
          {user?.role === 'registered' && (
             <NavLink to="/dashboard" className="btn bg-yellow-400 text-yellow-900 hover:bg-yellow-300 py-1 px-3 text-sm">Mis Reservas</NavLink>
          )}
          
          {(user?.role === 'worker' || user?.role === 'admin') && (
             <NavLink to="/management" className="btn bg-blue-600 text-white hover:bg-blue-500 py-1 px-3 text-sm">Gestión</NavLink>
          )}

          {!user ? (
            <Link to="/login" className="btn bg-white text-orange-600 hover:bg-gray-100 py-1 px-4 text-sm shadow-md">
              Login
            </Link>
          ) : (
            <div className="flex items-center gap-3 ml-4">
               <span className="bg-orange-800/50 text-white text-xs px-2 py-1 rounded hidden sm:block">Hola, {user.username}</span>
               <button onClick={logout} className="btn border border-white text-white hover:bg-white hover:text-orange-600 py-1 px-3 text-xs">
                Salir
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
