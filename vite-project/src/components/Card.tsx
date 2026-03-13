import React from 'react';
import './Card.css';

// ── Tipos ──────────────────────────────────────────────────────────────────

type CardVariant = 'default' | 'elevated' | 'outlined' | 'flat';

export type ProjectStatus = 'activo' | 'pendiente' | 'error' | 'archivado';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
  as?: React.ElementType;
  'aria-label'?: string;
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  justify?: 'start' | 'end' | 'between' | 'center';
}

export interface ProjectCardProps {
  name: string;
  url: string;
  status: ProjectStatus;
  lastCheck?: string;
  score?: number;
  onEdit?: () => void;
  onViewReport?: () => void;
  className?: string;
}

// ── Sub-componentes ────────────────────────────────────────────────────────

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, action, className = '' }) => (
  <div className={`card__header ${className}`}>
    <div className="card__header-text">
      <h3 className="card__title">{title}</h3>
      {subtitle && <p className="card__subtitle">{subtitle}</p>}
    </div>
    {action && <div className="card__header-action">{action}</div>}
  </div>
);

export const CardContent: React.FC<CardContentProps> = ({ children, className = '', noPadding = false }) => (
  <div className={`card__content${noPadding ? ' card__content--no-padding' : ''} ${className}`}>
    {children}
  </div>
);

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '', justify = 'end' }) => (
  <div className={`card__footer card__footer--${justify} ${className}`}>
    {children}
  </div>
);

// ── Componente principal Card ──────────────────────────────────────────────

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  as: Tag = 'div',
  'aria-label': ariaLabel,
}) => (
  <Tag
    className={`card card--${variant} ${className}`}
    aria-label={ariaLabel}
  >
    {children}
  </Tag>
);

// ── Variante específica: ProjectCard ───────────────────────────────────────

const STATUS_LABELS: Record<ProjectStatus, string> = {
  activo: 'Activo',
  pendiente: 'Pendiente',
  error: 'Error',
  archivado: 'Archivado',
};

const STATUS_ICONS: Record<ProjectStatus, string> = {
  activo: '●',
  pendiente: '◐',
  error: '✕',
  archivado: '○',
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
  name,
  url,
  status,
  lastCheck,
  score,
  onEdit,
  onViewReport,
  className = '',
}) => (
  <Card
    variant="elevated"
    className={`project-card ${className}`}
    aria-label={`Proyecto: ${name}, estado: ${STATUS_LABELS[status]}`}
  >
    <CardHeader
      title={name}
      subtitle={url}
      action={
        <span
          className={`project-card__status project-card__status--${status}`}
          role="status"
          aria-label={`Estado: ${STATUS_LABELS[status]}`}
        >
          <span aria-hidden="true">{STATUS_ICONS[status]}</span>
          {STATUS_LABELS[status]}
        </span>
      }
    />
    <CardContent>
      <div className="project-card__meta">
        {score !== undefined && (
          <div className="project-card__score" aria-label={`Puntuación de accesibilidad: ${score} de 100`}>
            <span className="project-card__score-label">Score</span>
            <div className="project-card__score-bar" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100}>
              <div className="project-card__score-fill" style={{ width: `${score}%` }} />
            </div>
            <span className="project-card__score-value">{score}/100</span>
          </div>
        )}
        {lastCheck && (
          <p className="project-card__last-check">
            <span aria-hidden="true">🕐</span> Última revisión: <time>{lastCheck}</time>
          </p>
        )}
      </div>
    </CardContent>
    <CardFooter justify="between">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="card-btn card-btn--ghost"
        aria-label={`Visitar sitio web de ${name} (abre en nueva pestaña)`}
      >
        Ver sitio
      </a>
      <div className="project-card__actions">
        {onEdit && (
          <button onClick={onEdit} className="card-btn card-btn--secondary" aria-label={`Editar proyecto ${name}`}>
            Editar
          </button>
        )}
        {onViewReport && (
          <button onClick={onViewReport} className="card-btn card-btn--primary" aria-label={`Ver informe de accesibilidad de ${name}`}>
            Ver Informe
          </button>
        )}
      </div>
    </CardFooter>
  </Card>
);

export default Card;
