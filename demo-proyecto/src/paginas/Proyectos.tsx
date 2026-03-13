import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dbService } from '../servicios/dbService';
import type { Project } from '../types/tiposDatos';

interface ProyectosPageProps {
  userRole: string;
}

const Proyectos: React.FC<ProyectosPageProps> = ({ userRole }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    dbService.getProjects().then(setProjects);
  }, []);

  const handleCreate = async () => {
    const name = prompt("Nombre del nuevo proyecto:");
    if (!name) return;
    try {
      await dbService.createProject({
          name,
          url: `https://${name.toLowerCase().replace(/\s/g, '-')}.com`,
          tenantId: 'demo',
          userId: 'current'
      });
      const freshData = await dbService.getProjects();
      setProjects(freshData);
    } catch (error) {
      alert("Error creando proyecto");
    }
  };

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ margin: 0 }}>Proyectos</h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
              <input 
                  type="text" 
                  placeholder="Buscar proyecto..." 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db', width: '250px' }}
              />
              <button 
                onClick={handleCreate} 
                style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
              >
                  + Nuevo Proyecto
              </button>
          </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {filteredProjects.map((project) => (
          <div key={project.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>{project.name}</h3>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '15px' }}>
              {project.description || 'Sin descripción disponible'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', background: '#f3f4f6', padding: '4px 8px', borderRadius: '999px', color: '#374151', textTransform: 'capitalize' }}>
                {project.status || 'Activo'}
              </span>
              <Link 
                to={`/proyectos/${project.id}`} 
                style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}
              >
                Ver Detalles →
              </Link>
            </div>
          </div>
        ))}
        {filteredProjects.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
            No se encontraron proyectos.
          </div>
        )}
      </div>
    </div>
  );
};

export default Proyectos;
