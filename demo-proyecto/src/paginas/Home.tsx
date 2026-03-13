import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '../types/tiposDatos';
import { dbService } from '../servicios/dbService';

interface HomeProps {
  userRole: string;
}

const StatCard = ({ title, count }: { title: string; count: number }) => (
  <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#f9f9f9', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
    <h3 style={{ margin: '0 0 10px 0', fontSize: '2rem', color: '#007bff' }}>{count}</h3>
    <p style={{ margin: 0, color: '#666' }}>{title}</p>
  </div>
);

const SectionCard = ({ title, link, desc }: { title: string; link: string; desc: string }) => (
  <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginBottom: '15px', backgroundColor: 'white' }}>
    <h4 style={{ marginTop: 0 }}>{title}</h4>
    <p style={{ fontSize: '0.9rem', color: '#666' }}>{desc}</p>
    <Link to={link} style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>Ver detalle →</Link>
  </div>
);

const Home: React.FC<HomeProps> = ({ userRole }) => {
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar proyectos recientes
  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const data = await dbService.getProjects();
        // Tomamos los últimos 3 para "Recientes"
        setRecentProjects(data.slice(0, 3));
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', color: '#111827' }}>Panel de Control</h1>
      
      {loading ? (
          <p>Cargando información del panel...</p>
      ) : (
        <div>
          <p style={{ marginBottom: '30px' }}>Bienvenido de nuevo, <strong style={{ textTransform: 'capitalize' }}>{userRole}</strong></p>
          
          {/* SECCIÓN 1: Resumen (Solo SuperAdmin) */}
          {userRole === 'superAdmin' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              <StatCard title="Proyectos Activos" count={12} />
              <StatCard title="Informes Generados" count={45} />
              <StatCard title="Usuarios Registrados" count={8} />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            {/* SECCIÓN 2: Proyectos Recientes */}
            {['superAdmin', 'admin', 'editor'].includes(userRole) && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Proyectos Recientes</h2>
                  <Link to="/proyectos" style={{ fontSize: '0.9rem', color: '#007bff' }}>Ver todos</Link>
                </div>
                
                {recentProjects.length > 0 ? (
                  recentProjects.map(p => (
                    <SectionCard key={p.id} title={p.name} link={`/proyectos/${p.id}`} desc={`Estado: ${p.status}`} />
                  ))
                ) : (
                  <p>No hay proyectos recientes.</p>
                )}
              </div>
            )}

            {/* SECCIÓN 3: Informes Recientes */}
            {['superAdmin', 'admin', 'editor', 'viewer'].includes(userRole) && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Informes Recientes</h2>
                  <Link to="/informes" style={{ fontSize: '0.9rem', color: '#007bff' }}>Ver todos</Link>
                </div>
                <SectionCard title="Informe SEO - Alpha" link="/informes" desc="Generado el 20/10/2023" />
                <SectionCard title="Performance Q3" link="/informes" desc="Generado el 18/10/2023" />
                <SectionCard title="Accesibilidad Web" link="/informes" desc="Generado el 15/10/2023" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
