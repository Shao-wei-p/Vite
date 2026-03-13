import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ListaProyecto from '../components/ListaProyecto';
import Footer from '../components/Footer';
// CORRECCIÓN: Usar 'import type'
import type { Project } from '../types/tiposDatos';
import { dbService } from '../servicios/dbService';

interface HomeProps {
  onLogout: () => void;
  userRole: string;
}

const Home: React.FC<HomeProps> = ({ onLogout, userRole }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar proyectos al montar el componente
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await dbService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error cargando proyectos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    const name = prompt("Nombre del proyecto:");
    if (!name) return;
    
    // Datos dummy para la creación rápida
    try {
        await dbService.createProject({
            name,
            url: `https://${name.toLowerCase().replace(/\s/g, '-')}.com`,
            tenantId: '11111111-1111-1111-1111-111111111111', // Tenant Demo por defecto
            userId: '0000' // ID genérico
        });
        await loadProjects(); // Recargar lista
    } catch (e) {
        alert("Error al crear proyecto");
        console.error(e);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este proyecto?")) return;
    try {
        await dbService.deleteProject(id);
        setProjects(prev => prev.filter(p => p.id !== id));
    } catch (e) {
        console.error(e);
    }
  };

  return (
    // CAMBIO: height: 100vh y overflow: hidden fijan el contenedor al tamaño de la ventana
    <div style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden' }}>
      {/* Navbar lateral */}
      <Navbar 
        onLogout={onLogout} 
        onSettings={() => console.log('Configuración')} 
        userRole={userRole} 
      />
      
      {/* Contenido principal */}
      {/* CAMBIO: overflowY: auto permite scroll interno independiente del Navbar */}
      <main style={{ 
        flex: 1, 
        padding: '2rem', 
        backgroundColor: '#f3f4f6', 
        display: 'flex', 
        flexDirection: 'column',
        overflowY: 'auto', 
        minWidth: 0 // Crucial para responsive en flexbox (evita overflow horizontal forzado)
      }}>
        <h1 style={{ marginBottom: '2rem', color: '#111827' }}>Panel de Control</h1>
        
        {loading ? (
            <p>Cargando datos...</p>
        ) : (
            <ListaProyecto 
              projects={projects}
              onNewProject={handleCreateProject}
              onEdit={(id) => console.log('Editar', id)}
              onDelete={handleDeleteProject}
            />
        )}

        <footer style={{ marginTop: 'auto', paddingTop: '3rem', textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
           <Footer />
        </footer>
      </main>
    </div>
  );
};

export default Home;
