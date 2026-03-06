export default function Location() {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Nuestra Ubicación 📍</h1>
      <p>Nos encontramos en el corazón de la ciudad.</p>
      <div style={{ 
        width: '100%', 
        height: '400px', 
        background: '#000000', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginTop: '20px',
        borderRadius: '10px'
      }}>
        <h2 style={{ color: '#7f8c8d' }}>[ Mapa de Google Maps Aquí ]</h2>
      </div>
      <p>Plaza del Ayuntamiento, 1, 46002 València</p>
    </div>
  );
}
