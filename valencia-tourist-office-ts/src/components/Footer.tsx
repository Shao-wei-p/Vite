import React from 'react';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Valencia Tourist Office</h4>
          <p>Tu guía oficial para descubrir la luz, el fuego y la pasión del Mediterráneo.</p>
        </div>
        <div className="footer-section">
          <h4>Contacto</h4>
          <p>📍 Plaza del Ayuntamiento, 1</p>
          <p>📧 info@valenciatour.com</p>
          <p>📞 +34 963 00 00 00</p>
        </div>
        <div className="footer-section">
          <h4>Enlaces Rápidos</h4>
          <ul className="footer-links">
            <li>Aviso Legal</li>
            <li>Política de Privacidad</li>
            <li>Mapa del Sitio</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Valencia Tourist Office. Todos los derechos reservados.
      </div>
    </footer>
  );
};
