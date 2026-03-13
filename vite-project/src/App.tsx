import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Card, { CardHeader, CardContent, CardFooter, ProjectCard } from './components/Card';
import DynamicForm from './components/DynamicForm';
import type { FormFieldConfig } from './components/DynamicForm';
import DataList from './components/DataList';
import type { DataColumn, RowAction } from './components/DataList';
import Footer from './components/Footer';

// ── Tipos de demo ──────────────────────────────────────────────────────────

interface Project {
  id: number;
  name: string;
  url: string;
  status: 'Activo' | 'Pendiente' | 'Error' | 'Archivado';
  score: number;
  lastCheck: string;
}

// ── Datos de demo ──────────────────────────────────────────────────────────

const DEMO_PROJECTS: Project[] = [
  { id: 1, name: 'Portal Ciudadano',      url: 'https://portal.ejemplo.es',   status: 'Activo',    score: 92, lastCheck: '12/06/2025' },
  { id: 2, name: 'Web Municipal',          url: 'https://municipal.ejemplo.es', status: 'Pendiente', score: 58, lastCheck: '10/06/2025' },
  { id: 3, name: 'Sede Electrónica',       url: 'https://sede.ejemplo.es',     status: 'Error',     score: 34, lastCheck: '08/06/2025' },
  { id: 4, name: 'Intranet Corporativa',   url: 'https://intranet.ejemplo.es', status: 'Archivado', score: 75, lastCheck: '01/05/2025' },
];

const TABLE_COLUMNS: DataColumn<Project>[] = [
  { key: 'name',      header: 'Proyecto',  width: '25%' },
  { key: 'url',       header: 'URL',       width: '30%',
    render: row => (
      <a href={row.url} target="_blank" rel="noopener noreferrer"
        style={{ color: '#4f46e5', textDecoration: 'none', fontSize: '0.82rem' }}
        aria-label={`Visitar ${row.url} (abre en nueva pestaña)`}>
        {row.url}
      </a>
    )
  },
  { key: 'status',    header: 'Estado',    width: '15%', align: 'center',
    render: row => {
      const map: Record<string, string> = {
        Activo: '#dcfce7|#166534', Pendiente: '#fef9c3|#854d0e',
        Error:  '#fee2e2|#991b1b', Archivado: '#f3f4f6|#6b7280',
      };
      const [bg, color] = map[row.status]?.split('|') ?? ['#f3f4f6', '#374151'];
      return (
        <span style={{ background: bg, color, padding: '0.2rem 0.65rem',
          borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
          {row.status}
        </span>
      );
    }
  },
  { key: 'score',     header: 'Score',     width: '15%', align: 'center',
    render: row => {
      const color = row.score >= 80 ? '#16a34a' : row.score >= 50 ? '#d97706' : '#dc2626';
      return <strong style={{ color }}>{row.score}/100</strong>;
    }
  },
  { key: 'lastCheck', header: 'Última revisión', align: 'right' },
];

const TABLE_ACTIONS: RowAction<Project>[] = [
  { label: 'Editar',       icon: '✏️', variant: 'default',
    ariaLabel: row => `Editar proyecto ${row.name}`,
    onClick: row => alert(`Editar: ${row.name}`) },
  { label: 'Ver Informe',  icon: '📄', variant: 'default',
    ariaLabel: row => `Ver informe de ${row.name}`,
    onClick: row => alert(`Informe: ${row.name}`) },
  { label: 'Eliminar',     icon: '🗑️', variant: 'danger',
    ariaLabel: row => `Eliminar proyecto ${row.name}`,
    onClick: row => alert(`Eliminar: ${row.name}`) },
];

const FORM_FIELDS: FormFieldConfig[] = [
  { name: 'name',     label: 'Nombre del proyecto', type: 'text',  required: true,
    placeholder: 'Ej: Portal Ciudadano' },
  { name: 'url',      label: 'URL del sitio web',   type: 'url',   required: true,
    placeholder: 'https://ejemplo.es',
    validate: v => typeof v === 'string' && v && !v.startsWith('http')
      ? 'La URL debe comenzar con http:// o https://' : null },
  { name: 'category', label: 'Categoría',            type: 'select', required: true,
    options: [
      { value: 'publico',    label: 'Organismo Público' },
      { value: 'educacion',  label: 'Educación' },
      { value: 'sanidad',    label: 'Sanidad' },
      { value: 'transporte', label: 'Transporte' },
    ]
  },
  { name: 'notes',    label: 'Notas adicionales',   type: 'textarea',
    placeholder: 'Observaciones sobre el sitio…',
    helpText: 'Opcional. Máximo 500 caracteres.' },
  { name: 'notify',   label: 'Recibir alertas por email al detectar errores', type: 'checkbox' },
];

// ── Estilos de layout inline ───────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  app: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    background: '#f3f4f6',
  },
  // El contenido se desplaza para no quedar bajo el sidebar
  pageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    marginLeft: '240px',       // Igual a --sidebar-width
    minWidth: 0,
    transition: 'margin-left 0.25s ease',
  },
  main: {
    flex: 1,
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
    width: '100%',
    boxSizing: 'border-box' as const,
  },
  section:      { marginBottom: '3rem' },
  sectionHead:  { marginBottom: '1.25rem' },
  sectionTitle: { margin: '0 0 0.25rem', fontSize: '1.25rem', fontWeight: 700, color: '#111827' },
  sectionSub:   { margin: 0, fontSize: '0.875rem', color: '#6b7280' },
  grid3:        { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' },
  formWrap:     { maxWidth: '640px' },
};

// ── App ────────────────────────────────────────────────────────────────────
const App: React.FC = () => {
  const [userName] = useState('María García');

  const handleLogout   = () => alert('Sesión cerrada');
  const handleSettings = () => alert('Abriendo configuración…');
  const handleFormSubmit = async (values: Record<string, string | boolean>) => {
    await new Promise(r => setTimeout(r, 1500));
    console.log('Formulario enviado:', values);
  };

  return (
    <div style={styles.app}>
      {/* ── Sidebar izquierdo ── */}
      <Navbar
        userName={userName}
        onLogout={handleLogout}
        onSettings={handleSettings}
      />

      {/* ── Contenido principal (desplazado a la derecha del sidebar) ── */}
      <div style={styles.pageWrapper}>
        <main style={styles.main} id="main-content">

          {/* ── 1. Cards básicas ── */}
          <section style={styles.section} aria-labelledby="cards-title">
            <div style={styles.sectionHead}>
              <h2 style={styles.sectionTitle} id="cards-title">Resumen de la plataforma</h2>
              <p style={styles.sectionSub}>Métricas generales de accesibilidad</p>
            </div>
            <div style={styles.grid3}>
              <Card variant="elevated" aria-label="Total de proyectos analizados">
                <CardHeader title="Total Proyectos" subtitle="Todos los entornos" />
                <CardContent>
                  <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, color: '#4f46e5' }}>24</p>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#6b7280' }}>
                    +3 este mes
                  </p>
                </CardContent>
                <CardFooter justify="end">
                  <a href="/proyecto" className="card-btn card-btn--ghost">Ver todos →</a>
                </CardFooter>
              </Card>

              <Card variant="elevated" aria-label="Score medio de accesibilidad">
                <CardHeader title="Score Medio" subtitle="WCAG 2.1 AA" />
                <CardContent>
                  <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, color: '#16a34a' }}>78</p>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#6b7280' }}>
                    +5 puntos respecto al mes anterior
                  </p>
                </CardContent>
                <CardFooter justify="end">
                  <a href="/informe" className="card-btn card-btn--ghost">Ver informes →</a>
                </CardFooter>
              </Card>

              <Card variant="elevated" aria-label="Errores críticos detectados">
                <CardHeader title="Errores Críticos" subtitle="Requieren atención inmediata" />
                <CardContent>
                  <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, color: '#dc2626' }}>7</p>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#6b7280' }}>
                    En 3 proyectos activos
                  </p>
                </CardContent>
                <CardFooter justify="end">
                  <a href="/informe" className="card-btn card-btn--ghost">Revisar →</a>
                </CardFooter>
              </Card>
            </div>
          </section>

          {/* ── 2. ProjectCards ── */}
          <section style={styles.section} aria-labelledby="projects-title">
            <div style={styles.sectionHead}>
              <h2 style={styles.sectionTitle} id="projects-title">Proyectos Recientes</h2>
              <p style={styles.sectionSub}>Estado e indicadores de accesibilidad por proyecto</p>
            </div>
            <div style={styles.grid3}>
              {DEMO_PROJECTS.map(p => (
                <ProjectCard
                  key={p.id}
                  name={p.name}
                  url={p.url}
                  status={p.status.toLowerCase() as 'activo' | 'pendiente' | 'error' | 'archivado'}
                  score={p.score}
                  lastCheck={p.lastCheck}
                  onEdit={() => alert(`Editar: ${p.name}`)}
                  onViewReport={() => alert(`Informe: ${p.name}`)}
                />
              ))}
            </div>
          </section>

          {/* ── 3. DataList ── */}
          <section style={styles.section} aria-labelledby="datalist-title">
            <div style={styles.sectionHead}>
              <h2 style={styles.sectionTitle} id="datalist-title">Lista de Proyectos</h2>
              <p style={styles.sectionSub}>Gestiona y accede a todos los proyectos</p>
            </div>
            <DataList
              caption="Proyectos registrados en la plataforma"
              columns={TABLE_COLUMNS}
              data={DEMO_PROJECTS}
              actions={TABLE_ACTIONS}
              searchable
              searchPlaceholder="Buscar por nombre, URL o estado…"
              emptyTitle="No hay proyectos aún"
              emptyDescription="Añade tu primer proyecto usando el formulario de abajo."
              emptyAction={{ label: '+ Nuevo Proyecto', onClick: () => alert('Nuevo proyecto') }}
            />
          </section>

          {/* ── 4. DynamicForm ── */}
          <section style={styles.section} aria-labelledby="form-title">
            <div style={styles.sectionHead}>
              <h2 style={styles.sectionTitle} id="form-title">Añadir Nuevo Proyecto</h2>
              <p style={styles.sectionSub}>Registra un sitio web para analizar su accesibilidad</p>
            </div>
            <div style={styles.formWrap}>
              <DynamicForm
                title="Datos del Proyecto"
                subtitle="Todos los campos marcados con * son obligatorios."
                fields={FORM_FIELDS}
                onSubmit={handleFormSubmit}
                submitLabel="Crear Proyecto"
              />
            </div>
          </section>

        </main>

        {/* ── Footer ── */}
        <Footer version="1.0.0" organizationName="New Aucctoritas" />
      </div>
    </div>
  );
};

export default App;
