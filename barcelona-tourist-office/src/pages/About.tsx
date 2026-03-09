import React from 'react';

const About: React.FC = () => {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1rem' }}>
            <h1 className="text-2xl font-bold mb-4">Sobre Nosotros</h1>
            <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                La Oficina de Turismo de Barcelona es la entidad oficial responsable de la promoción y dinamización turística de la ciudad.
                Trabajamos para ofrecer a los visitantes una experiencia inolvidable, sostenible y respetuosa con el entorno local.
            </p>
            <p style={{ lineHeight: '1.6' }}>
                Nuestro equipo está formado por expertos locales apasionados por la cultura, la gastronomía y la historia de Barcelona.
            </p>
        </div>
    );
};

export default About;
