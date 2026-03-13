import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';

interface NavbarProps {
  onLogout?: () => void;
  onSettings?: () => void;
  userName?: string;
  className?: string;
}

const NAV_LINKS = [
  { label: 'Inicio',                    href: '/',             icon: '⌂' },
  { label: 'Proyecto',                  href: '/proyecto',     icon: '◫' },
  { label: 'Informe',                   href: '/informe',      icon: '📄' },
  { label: 'Real Decreto 1112/2018',    href: '/real-decreto', icon: '⚖' },
];

const Navbar: React.FC<NavbarProps> = ({ onLogout, onSettings, userName, className = '' }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  // Cierra el sidebar móvil con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) setMobileOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  // Cierra al hacer clic fuera en móvil
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileOpen && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileOpen]);

  return (
    <>
      {/* ── Botón hamburguesa solo en móvil ── */}
      <button
        className="navbar__mobile-toggle"
        aria-label={mobileOpen ? 'Cerrar menú lateral' : 'Abrir menú lateral'}
        aria-expanded={mobileOpen}
        aria-controls="sidebar-nav"
        onClick={() => setMobileOpen(prev => !prev)}
      >
        <span className="navbar__toggle-bar" aria-hidden="true" />
        <span className="navbar__toggle-bar" aria-hidden="true" />
        <span className="navbar__toggle-bar" aria-hidden="true" />
      </button>

      {/* ── Overlay móvil ── */}
      {mobileOpen && (
        <div
          className="navbar__overlay"
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        id="sidebar-nav"
        ref={sidebarRef}
        className={[
          'navbar',
          collapsed ? 'navbar--collapsed' : '',
          mobileOpen ? 'navbar--mobile-open' : '',
          className,
        ].filter(Boolean).join(' ')}
        aria-label="Menú de navegación lateral"
      >
        {/* Logo + toggle colapso */}
        <div className="navbar__brand">
          <a href="/" className="navbar__logo" aria-label="New Aucctoritas – Ir al inicio">
            <span className="navbar__logo-icon" aria-hidden="true">⬡</span>
            {!collapsed && (
              <span className="navbar__logo-text">
                New <strong>Aucctoritas</strong>
              </span>
            )}
          </a>
          <button
            className="navbar__collapse-btn"
            onClick={() => setCollapsed(prev => !prev)}
            aria-label={collapsed ? 'Expandir menú lateral' : 'Colapsar menú lateral'}
            aria-expanded={!collapsed}
            title={collapsed ? 'Expandir' : 'Colapsar'}
          >
            <svg aria-hidden="true" focusable="false" width="16" height="16"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}>
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>

        {/* Usuario */}
        {userName && (
          <div className="navbar__user" aria-label={`Usuario conectado: ${userName}`}>
            <span className="navbar__user-avatar" aria-hidden="true">
              {userName.charAt(0).toUpperCase()}
            </span>
            {!collapsed && (
              <div className="navbar__user-info">
                <span className="navbar__user-name">{userName}</span>
                <span className="navbar__user-role">Administrador</span>
              </div>
            )}
          </div>
        )}

        {/* Separador */}
        <hr className="navbar__divider" aria-hidden="true" />

        {/* Navegación principal */}
        <nav aria-label="Navegación principal">
          <ul className="navbar__list" role="list">
            {NAV_LINKS.map(link => (
              <li key={link.href} className="navbar__item">
                <a
                  href={link.href}
                  className="navbar__link"
                  onClick={() => setMobileOpen(false)}
                  title={collapsed ? link.label : undefined}
                  aria-label={collapsed ? link.label : undefined}
                >
                  <span className="navbar__link-icon" aria-hidden="true">{link.icon}</span>
                  {!collapsed && <span className="navbar__link-label">{link.label}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Separador */}
        <hr className="navbar__divider" aria-hidden="true" />

        {/* Acciones inferiores */}
        <div className="navbar__actions">
          <button
            className="navbar__btn navbar__btn--icon"
            onClick={onSettings}
            aria-label="Abrir configuración"
            title="Configuración"
          >
            <svg aria-hidden="true" focusable="false" width="18" height="18"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            {!collapsed && <span>Configuración</span>}
          </button>

          <button
            className="navbar__btn navbar__btn--logout"
            onClick={onLogout}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <svg aria-hidden="true" focusable="false" width="18" height="18"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {!collapsed && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
