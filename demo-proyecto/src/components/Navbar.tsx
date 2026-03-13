import React, { useState } from 'react';
import './Navbar.css';

interface NavbarProps {
  appName?: string;
  onLogout: () => void;
  onSettings: () => void;
  userRole: string; // 'superAdmin' | 'admin' | ...
}

const Navbar: React.FC<NavbarProps> = ({ 
  appName = "Demo Proyecto", 
  onLogout, 
  onSettings, 
  userRole 
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const canManageUsers = ['superAdmin', 'admin'].includes(userRole);

  const navItems = [
    { label: 'Inicio',    icon: '🏠', href: '/dashboard' },
    { label: 'Proyectos', icon: '📁', href: '/projects' },
    { label: 'Informes',  icon: '📊', href: '/reports' },
    ...(canManageUsers ? [{ label: 'Usuarios', icon: '👥', href: '/users' }] : []),
  ];

  return (
    <aside className={`navbar ${collapsed ? 'navbar--collapsed' : ''}`} aria-label="Menú principal">
      {/* ── Parte Superior: Logo ── */}
      <div className="navbar__header">
        <div className="navbar__logo" aria-label={appName}>
          <span className="navbar__logo-icon" aria-hidden="true">⬡</span>
          {!collapsed && <span className="navbar__logo-text">{appName}</span>}
        </div>
        <button 
          className="navbar__toggle"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {collapsed ? '»' : '«'}
        </button>
      </div>

      {/* ── Parte Central: Navegación ── */}
      <nav className="navbar__nav">
        <ul className="navbar__list">
          {navItems.map((item) => (
            <li key={item.label} className="navbar__item">
              <a href={item.href} className="navbar__link">
                <span className="navbar__icon" aria-hidden="true">{item.icon}</span>
                {!collapsed && <span className="navbar__label">{item.label}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Parte Inferior: Acciones ── */}
      <div className="navbar__footer">
        <button onClick={onSettings} className="navbar__btn" title="Configuración">
          <span aria-hidden="true">⚙️</span>
          {!collapsed && <span>Configuración</span>}
        </button>
        <button onClick={onLogout} className="navbar__btn navbar__btn--logout" title="Cerrar Sesión">
          <span aria-hidden="true">🚪</span>
          {!collapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
};

export default Navbar;
