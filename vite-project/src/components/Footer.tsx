import React from 'react';
import './Footer.css';

// ── Tipos ──────────────────────────────────────────────────────────────────

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterProps {
  version?: string;
  organizationName?: string;
  legalLinks?: FooterLink[];
  className?: string;
}

// ── Datos por defecto ──────────────────────────────────────────────────────

const DEFAULT_LEGAL_LINKS: FooterLink[] = [
  { label: 'Política de Privacidad', href: '/privacidad' },
  { label: 'Términos de Uso', href: '/terminos' },
  { label: 'Accesibilidad', href: '/accesibilidad' },
  { label: 'Aviso Legal', href: '/aviso-legal' },
];

// ── Componente Footer ──────────────────────────────────────────────────────

const Footer: React.FC<FooterProps> = ({
  version = '1.0.0',
  organizationName = 'New Aucctoritas',
  legalLinks = DEFAULT_LEGAL_LINKS,
  className = '',
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`footer ${className}`} role="contentinfo" aria-label="Pie de página">
      <div className="footer__inner">
        {/* Columna izquierda: logo y descripción */}
        <div className="footer__brand">
          <a href="/" className="footer__logo" aria-label={`${organizationName} – Ir al inicio`}>
            <span className="footer__logo-icon" aria-hidden="true">⬡</span>
            <span className="footer__logo-text">
              New <strong>Aucctoritas</strong>
            </span>
          </a>
          <p className="footer__tagline">
            Plataforma SaaS de accesibilidad web para cumplimiento del{' '}
            <a
              href="https://www.boe.es/eli/es/rd/2018/09/07/1112"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__external-link"
              aria-label="Real Decreto 1112/2018 (abre en nueva pestaña)"
            >
              RD 1112/2018
            </a>
            .
          </p>
          <div className="footer__version-badge" aria-label={`Versión de la plataforma: ${version}`}>
            <span aria-hidden="true">v</span>{version}
          </div>
        </div>

        {/* Columna central: recursos */}
        <nav className="footer__nav" aria-label="Recursos">
          <h3 className="footer__nav-title">Recursos</h3>
          <ul className="footer__nav-list" role="list">
            <li><a href="/documentacion" className="footer__nav-link">Documentación</a></li>
            <li><a href="/real-decreto" className="footer__nav-link">Real Decreto 1112/2018</a></li>
            <li><a href="/wcag" className="footer__nav-link">Guía WCAG 2.1</a></li>
            <li><a href="/soporte" className="footer__nav-link">Soporte técnico</a></li>
          </ul>
        </nav>

        {/* Columna derecha: plataforma */}
        <nav className="footer__nav" aria-label="Plataforma">
          <h3 className="footer__nav-title">Plataforma</h3>
          <ul className="footer__nav-list" role="list">
            <li><a href="/panel" className="footer__nav-link">Panel de control</a></li>
            <li><a href="/proyecto" className="footer__nav-link">Mis proyectos</a></li>
            <li><a href="/informe" className="footer__nav-link">Informes</a></li>
            <li><a href="/admin-settings" className="footer__nav-link">Configuración</a></li>
          </ul>
        </nav>
      </div>

      {/* Barra inferior */}
      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <p className="footer__copyright">
            <span aria-hidden="true">©</span>{' '}
            <time dateTime={String(currentYear)}>{currentYear}</time>{' '}
            {organizationName}. Todos los derechos reservados.
          </p>

          {/* Links legales */}
          <nav aria-label="Enlaces legales">
            <ul className="footer__legal-list" role="list">
              {legalLinks.map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="footer__legal-link"
                    {...(link.external
                      ? { target: '_blank', rel: 'noopener noreferrer', 'aria-label': `${link.label} (abre en nueva pestaña)` }
                      : {})}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Conformidad WCAG */}
          <div className="footer__wcag-badge" aria-label="Conformidad WCAG 2.1 nivel AA">
            <span aria-hidden="true">♿</span>
            <span>WCAG 2.1 AA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
