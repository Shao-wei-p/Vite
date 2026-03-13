import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dbService } from '../servicios/dbService';
import type { Project } from '../types/tiposDatos';

interface DetalleProps {
  userRole: string;
}

const DetalleProyecto: React.FC<DetalleProps> = ({ userRole }) => {
  const [project, setProject] = useState<Project | null>(null);
  const { id } = useParams();

  useEffect(() => {
    // Simulamos buscar el proyecto específico. En una app real usaríamos getProjectById(id)
    dbService.getProjects().then(projects => {
        const found = projects.find(p => p.id === id) || projects[0];
        setProject(found);
    });
  }, [id]);

  if (!project) return <div>Cargando detalles del proyecto...</div>;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
          <Link to="/proyectos" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-block', marginBottom: '10px' }}>
              &larr; Volver a proyectos
          </Link>
          <h1 style={{ margin: '0 0 10px 0' }}>Proyecto: {project.name}</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>
            URL Analizada: <a href={project.url} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>{project.url}</a>
          </p>
      </div>

      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #e5e7eb' }}>
          <h3 style={{ marginTop: 0 }}>Estadísticas Rápidas</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>Score SEO</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>85/100</div>
              </div>
              <div style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>Accesibilidad</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706' }}>90/100</div>
              </div>
              <div style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '4px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>Performance</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}>70/100</div>
              </div>
          </div>
      </div>

      <h3>Informes del Proyecto</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', backgroundColor: 'white' }}>
            <thead>
                <tr style={{ background: '#f9fafb', textAlign: 'left', borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '12px' }}>Nombre Informe</th>
                    <th style={{ padding: '12px' }}>Fecha</th>
                    <th style={{ padding: '12px' }}>Puntuación</th>
                    <th style={{ padding: '12px' }}>Acción</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>Análisis SEO Inicial</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>2023-10-01</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>85/100</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}><button style={{cursor:'pointer', padding: '4px 8px'}}>Ver</button></td>
                </tr>
                <tr>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>Auditoría Técnica</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>2023-10-05</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>92/100</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}><button style={{cursor:'pointer', padding: '4px 8px'}}>Ver</button></td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetalleProyecto;
