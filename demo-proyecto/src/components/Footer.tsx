const Footer = () => {
  return (
    <footer style={{ background: '#1f2937', color: '#9ca3af', padding: '2rem', marginTop: 'auto' }}>
      <div>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          <div>
            <h3>Nombre Proyecto</h3>
            <p>
              Pequeña introducción
            </p>
          </div>
          <div>
            <h3>Enlaces</h3>
            <ul  style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li><a href="#">Aviso Legal</a></li>
              <li><a href="#">Política de Privacidad</a></li>
              <li><a href="#">Términos de Uso</a></li>
            </ul>
          </div>
          <div>
            <h3>Recurso</h3>
            <p>Real Decreto 1112/2018</p>
            <p>Guía WCAG 2.1</p>
          </div>
        </div>
        <div>
          &copy; {new Date().getFullYear()} Nombre Proyecto. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;