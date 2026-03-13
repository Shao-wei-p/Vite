import React, { useState } from 'react';
// CORRECCIÓN: Usar 'import type' evita errores de ejecución con interfaces
import type { Project } from '../types/tiposDatos';
import './DataLists.css'; // Estilos compartidos para listas

interface ListaProyectoProps {
  projects: Project[];
  onNewProject: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ListaProyecto: React.FC<ListaProyectoProps> = ({ projects, onNewProject, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.url && p.url.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="data-list-container">
      <header className="list-header">
        <h2 className="list-title">Proyectos</h2>
        <div className="list-actions">
          <div className="search-wrapper">
            <span aria-hidden="true" className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Buscar proyectos..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
              aria-label="Buscar proyectos"
            />
          </div>
          <button onClick={onNewProject} className="btn-add">
            + Nuevo Proyecto
          </button>
        </div>
      </header>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha Creación</th>
              <th>URL</th>
              <th>Nombre</th>
              <th className="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.length > 0 ? (
              filteredProjects.map(project => (
                <tr key={project.id}>
                  <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                  <td>
                    <a href={project.url} className="link-table" target="_blank" rel="noopener noreferrer">
                      {project.url}
                    </a>
                  </td>
                  <td><strong>{project.name}</strong></td>
                  <td className="text-right">
                    <button onClick={() => onEdit(project.id)} className="btn-icon" aria-label={`Modificar ${project.name}`}>✏️</button>
                    <button onClick={() => onDelete(project.id)} className="btn-icon btn-danger" aria-label={`Eliminar ${project.name}`}>🗑️</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="empty-state">No se encontraron proyectos</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaProyecto;
