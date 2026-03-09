import React from 'react';

const Location: React.FC = () => {
    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1 className="text-2xl font-bold mb-6">Dónde Encontrarnos</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                <div style={{ border: '1px solid #eee', padding: '2rem', borderRadius: '8px' }}>
                    <h3 className="font-bold text-lg">Oficina Central (Plaça de Catalunya)</h3>
                    <p>Plaça de Catalunya, 17-S</p>
                    <p>08002 Barcelona</p>
                    <p style={{ marginTop: '1rem', color: '#0066cc' }}>Metro: L1, L3</p>
                </div>

                <div style={{ border: '1px solid #eee', padding: '2rem', borderRadius: '8px' }}>
                    <h3 className="font-bold text-lg">Punto de Información Sants</h3>
                    <p>Estació de Sants (Vestíbulo)</p>
                    <p>Plaça dels Països Catalans</p>
                    <p style={{ marginTop: '1rem', color: '#0066cc' }}>Metro: L3, L5</p>
                </div>
            </div>
            
            <div style={{ marginTop: '3rem', background: '#f0f0f0', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                (Mapa Interactivo Integrado Aquí)
            </div>
        </div>
    );
};

export default Location;
