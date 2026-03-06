import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white text-lg font-bold mb-4">🍊 Valencia Tourism</h3>
          <p className="text-sm">
            Tu guía oficial para descubrir los secretos del Mediterráneo. 
            Cultura, gastronomía y sol en un solo lugar.
          </p>
        </div>
        <div>
          <h3 className="text-white text-lg font-bold mb-4">Enlaces Rápidos</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-orange-400">Aviso Legal</a></li>
            <li><a href="#" className="hover:text-orange-400">Política de Privacidad</a></li>
            <li><a href="#" className="hover:text-orange-400">Trabaja con nosotros</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white text-lg font-bold mb-4">Contacto</h3>
          <p className="text-sm">📍 Plaza del Ayuntamiento, 1, Valencia</p>
          <p className="text-sm">📞 +34 963 00 00 00</p>
          <p className="text-sm">📧 info@valenciatourism.es</p>
        </div>
      </div>
      <div className="text-center text-xs text-gray-500 mt-8 border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} Oficina de Turismo de Valencia. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
