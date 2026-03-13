import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ListaProyecto from '../components/ListaProyecto';
import { dbService } from '../servicios/dbService';
import type { Project } from '../types/tiposDatos';

interface ProyectosPageProps {
  onLogout: () => void;
  userRole: string;
}

const Proyectos: React.FC<ProyectosPageProps> = ({ onLogout, userRole }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    dbService.getProjects().then(setProjects);
  }, []);

  const handleCreate = async () => {
    const name = prompt("Nombre del nuevo proyecto:");
    if (!name) return;
    await dbService.createProject({
        name,
        url: `https://${name.toLowerCase().replace(/\s/g, '-')}.com`,
        tenantId: 'demo',
        userId: 'current'
    });
    const freshData = await dbService.getProjects();
    setProjects(freshData);
  };

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', position: 'fixed', top: 0, left: 0 }}>
      <Navbar onLogout={onLogout} onSettings={() => {}} userRole={userRole} />
      
      <main style={{ flex: 1, padding: '2rem', backgroundColor: '#f3f4f6', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ margin: 0 }}>Proyectos</h1>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <input 
                    type="text" 
                    placeholder="Buscar proyecto..." 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
                />
                <button onClick={handleCreate} style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
                    + Nuevo Proyecto
                </button>
            </div>
        </div>

        <ListaProyecto 
            projects={filteredProjects}
            onNewProject={handleCreate} // Redundante si usamos el botón de arriba, pero requerido por props
            onEdit={(id) => alert(`Editar ${id}`)}
            onDelete={async (id) => {
                if(confirm('Borrar?')) {
                    await dbService.deleteProject(id);
                    setProjects(prev => prev.filter(p => p.id !== id));
                }
            }}
        />
      </main>
    </div>
  );
};

export default Proyectos;
