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

                <div style={{ marginTop: '3rem', width: '100%', height: '450px' }}>
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d314.6455109445357!2d2.171235888582219!3d41.386479311478226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4a342a4fcc95f%3A0xe773c2b5d8c1a1c0!2sTours%20a%20Barcelona!5e0!3m2!1ses!2ses!4v1773142368887!5m2!1ses!2ses" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen={true} 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Mapa de ubicación"
                    ></iframe>
                </div>

                <div style={{ border: '1px solid #eee', padding: '2rem', borderRadius: '8px' }}>
                    <h3 className="font-bold text-lg">Punto de Información Sants</h3>
                    <p>Estació de Sants (Vestíbulo)</p>
                    <p>Plaça dels Països Catalans</p>
                    <p style={{ marginTop: '1rem', color: '#0066cc' }}>Metro: L3, L5</p>
                </div>

                <div style={{ marginTop: '3rem', width: '100%', height: '450px' }}>
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d529.2256690011067!2d2.140393562081163!3d41.37946224963055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a49906a36e37ad%3A0xc2788765253c4700!2sEstaci%C3%B3n%20de%20Sants!5e0!3m2!1ses!2ses!4v1773142575073!5m2!1ses!2ses" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen={true} 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Mapa de ubicación"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default Location;
