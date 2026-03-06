import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="relative z-10 text-center px-4 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-extrabold mb-4 drop-shadow-lg text-white">VALENCIA</h1>
          <p className="text-xl md:text-3xl mb-8 font-light text-orange-100">Luz, Fuego y Mediterráneo</p>
          
          <div className="flex justify-center gap-4">
            <Link to="/activities" className="btn-secondary font-bold text-lg px-8 py-3 shadow-lg border-none">
              Ver Actividades
            </Link>
            <Link to="/contact" className="btn-ghost font-bold text-lg px-8 py-3">
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
