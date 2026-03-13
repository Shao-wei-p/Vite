import React from 'react';
// CORRECCIÓN: Usar 'import type'
import type { Project } from '../types/tiposDatos';

interface ProjectCardProps {
  project: Project;
  userRole: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  userRole, 
  onEdit, 
  onDelete,
  onView
}) => {
  const canModify = ['superAdmin', 'admin'].includes(userRole);

  return (
    <article 
      className="project-card" 
      aria-labelledby={`project-title-${project.id}`}
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '1.5rem',
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}
    >
      <header>
        <h3 id={`project-title-${project.id}`} style={{ margin: 0, fontSize: '1.25rem', color: '#111827' }}>
          {project.name}
        </h3>
        <a 
          href={project.url} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ fontSize: '0.875rem', color: '#4f46e5', textDecoration: 'none' }}
        >
          {project.url}
        </a>
      </header>

      <div style={{ flex: 1, color: '#6b7280', fontSize: '0.9rem' }}>
        <p>Creado el: <time dateTime={project.createdAt}>{new Date(project.createdAt).toLocaleDateString()}</time></p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        {onView && (
          <button 
            onClick={() => onView(project.id)}
            style={{ padding: '0.5rem 1rem', background: '#eef2ff', color: '#4f46e5', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Ver
          </button>
        )}
        
        {canModify && onEdit && (
          <button 
            onClick={() => onEdit(project.id)}
            style={{ padding: '0.5rem 1rem', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Editar
          </button>
        )}

        {canModify && onDelete && (
          <button 
            onClick={() => onDelete(project.id)}
            style={{ padding: '0.5rem 1rem', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Eliminar
          </button>
        )}
      </div>
    </article>
  );
};

export default ProjectCard;
