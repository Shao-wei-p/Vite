import React, { useEffect, useState } from 'react';
// CAMBIO: Importar useParams
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { dbService } from '../servicios/dbService';
import type { Project } from '../types/tiposDatos';

interface DetalleProps {
  // id ya no es obligatorio por props, viene de URL
  id?: string;
  onLogout: () => void;
  userRole: string;
}

const DetalleProyecto: React.FC<DetalleProps> = ({ id: propId, onLogout, userRole }) => {
  const [project, setProject] = useState<Project | null>(null);
  const navigate = useNavigate();
  // CAMBIO: Obtener ID de la URL
  const { id: urlId } = useParams();
  const finalId = urlId || propId || 'demo-id';

  useEffect(() => {
    dbService.getProjects().then(projects => {
        const found = projects.find(p => p.id === finalId) || projects[0];
        setProject(found);
    });
  }, [finalId]);

  if (!project) return <div>Cargando...</div>;

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', position: 'fixed', top: 0, left: 0 }}>
      <Navbar onLogout={onLogout} onSettings={() => {}} userRole={userRole} />
      
      <main style={{ flex: 1, padding: '2rem', backgroundColor: '#f3f4f6', overflowY: 'auto' }}>
        <div style={{ marginBottom: '2rem' }}>
            <button 
                onClick={() => navigate('/proyectos')} 
                style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.9rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
                &larr; Volver a proyectos
            </button>
            <h1 style={{ marginTop: '1rem' }}>{project.name}</h1>
            <p style={{ color: '#6b7280' }}>URL Analizada: <a href={project.url} target="_blank" rel="noreferrer" style={{ color: '#3b82f6' }}>{project.url}</a></p>
        </div>

        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
            <h3>Estadísticas Rápidas</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '4px' }}>Score SEO: 85/100</div>
                <div style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '4px' }}>Accesibilidad: 90/100</div>
                <div style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '4px' }}>Performance: 70/100</div>
            </div>
        </div>

        <h3>Informes Asociados</h3>
        <table style={{ width: '100%', marginTop: '1rem', backgroundColor: 'white', borderRadius: '8px', borderCollapse: 'collapse' }}>
            <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>
                    <th style={{ padding: '1rem' }}>Fecha</th>
                    <th style={{ padding: '1rem' }}>Versión</th>
                    <th style={{ padding: '1rem' }}>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style={{ padding: '1rem' }}>2023-11-01</td>
                    <td style={{ padding: '1rem' }}>v1.0.2</td>
                    <td style={{ padding: '1rem' }}><button>Ver Detalle</button></td>
                </tr>
            </tbody>
        </table>
      </main>
    </div>
  );
};

export default DetalleProyecto;
