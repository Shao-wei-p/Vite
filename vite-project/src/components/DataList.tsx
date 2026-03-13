import React, { useState } from 'react';
import './DataList.css';

// ── Tipos ──────────────────────────────────────────────────────────────────

export interface DataColumn<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  render?: (row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface RowAction<T> {
  label: string;
  icon?: string;
  variant?: 'default' | 'danger';
  onClick: (row: T) => void;
  ariaLabel?: (row: T) => string;
}

export interface DataListProps<T extends { id: string | number }> {
  columns: DataColumn<T>[];
  data: T[];
  actions?: RowAction<T>[];
  caption?: string;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: { label: string; onClick: () => void };
  className?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
}

// ── Empty State ────────────────────────────────────────────────────────────

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action }) => (
  <div className="datalist__empty" role="status" aria-live="polite">
    <div className="datalist__empty-icon" aria-hidden="true">
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    </div>
    <h3 className="datalist__empty-title">{title}</h3>
    {description && <p className="datalist__empty-desc">{description}</p>}
    {action && (
      <button onClick={action.onClick} className="datalist__empty-btn">
        {action.label}
      </button>
    )}
  </div>
);

// ── Skeleton de carga ──────────────────────────────────────────────────────

const SkeletonRow: React.FC<{ cols: number }> = ({ cols }) => (
  <tr className="datalist__skeleton-row" aria-hidden="true">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="datalist__cell">
        <div className="datalist__skeleton-bar" />
      </td>
    ))}
  </tr>
);

// ── Componente principal DataList ──────────────────────────────────────────

function DataList<T extends { id: string | number }>({
  columns,
  data,
  actions,
  caption,
  loading = false,
  emptyTitle = 'No hay datos disponibles',
  emptyDescription = 'Cuando añadas elementos aparecerán aquí.',
  emptyAction,
  className = '',
  searchable = false,
  searchPlaceholder = 'Buscar…',
}: DataListProps<T>) {
  const [search, setSearch] = useState('');
  const searchId = React.useId();

  const filtered = searchable && search.trim()
    ? data.filter(row =>
        Object.values(row as Record<string, unknown>).some(val =>
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      )
    : data;

  const totalCols = columns.length + (actions?.length ? 1 : 0);

  return (
    <div className={`datalist ${className}`}>
      {/* Barra de búsqueda */}
      {searchable && (
        <div className="datalist__toolbar">
          <label htmlFor={searchId} className="sr-only">Buscar en la lista</label>
          <div className="datalist__search-wrapper">
            <svg aria-hidden="true" focusable="false" className="datalist__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              id={searchId}
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="datalist__search"
              aria-controls="datalist-body"
            />
          </div>
          <span className="datalist__count" aria-live="polite" aria-atomic="true">
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      <div className="datalist__wrapper" role="region" aria-label={caption ?? 'Lista de datos'}>
        <table className="datalist__table" aria-busy={loading} aria-describedby={caption ? 'datalist-caption' : undefined}>
          {caption && <caption id="datalist-caption" className="datalist__caption">{caption}</caption>}
          <thead className="datalist__head">
            <tr>
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  scope="col"
                  className={`datalist__th datalist__th--${col.align ?? 'left'}`}
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th scope="col" className="datalist__th datalist__th--right datalist__th--actions">
                  <span className="sr-only">Acciones</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody id="datalist-body" className="datalist__body">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} cols={totalCols} />)
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={totalCols} className="datalist__cell datalist__cell--empty">
                  <EmptyState
                    title={search ? `Sin resultados para "${search}"` : emptyTitle}
                    description={search ? 'Intenta con otros términos de búsqueda.' : emptyDescription}
                    action={!search ? emptyAction : undefined}
                  />
                </td>
              </tr>
            ) : (
              filtered.map(row => (
                <tr key={row.id} className="datalist__row">
                  {columns.map(col => (
                    <td
                      key={String(col.key)}
                      className={`datalist__cell datalist__cell--${col.align ?? 'left'}`}
                    >
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key as string] ?? '—')}
                    </td>
                  ))}
                  {actions && actions.length > 0 && (
                    <td className="datalist__cell datalist__cell--actions">
                      <div className="datalist__actions" role="group" aria-label="Acciones de fila">
                        {actions.map(action => (
                          <button
                            key={action.label}
                            onClick={() => action.onClick(row)}
                            className={`datalist__action-btn datalist__action-btn--${action.variant ?? 'default'}`}
                            aria-label={action.ariaLabel ? action.ariaLabel(row) : action.label}
                            title={action.label}
                          >
                            {action.icon && <span aria-hidden="true">{action.icon}</span>}
                            <span className="datalist__action-label">{action.label}</span>
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataList;
