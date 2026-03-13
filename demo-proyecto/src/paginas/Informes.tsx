import React from 'react';
import Navbar from '../components/Navbar';

interface InformesPageProps {
  onLogout: () => void;
  userRole: string;
}

const Informes: React.FC<InformesPageProps> = ({ onLogout, userRole }) => {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', position: 'fixed', top: 0, left: 0 }}>
      <Navbar onLogout={onLogout} onSettings={() => {}} userRole={userRole} />
      
      <main style={{ flex: 1, padding: '2rem', backgroundColor: '#f3f4f6', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ margin: 0 }}>Informes Globales</h1>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <input type="text" placeholder="Buscar informe..." style={{ padding: '0.5rem', border: '1px solid #d1d5db' }} />
                {userRole !== 'viewer' && (
                    <button style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px' }}>
                        + Nuevo Informe
                    </button>
                )}
            </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <tr>
                        <th style={{ padding: '1rem' }}>ID</th>
                        <th style={{ padding: '1rem' }}>Proyecto</th>
                        <th style={{ padding: '1rem' }}>Estado</th>
                        <th style={{ padding: '1rem' }}>Fecha</th>
                        <th style={{ padding: '1rem' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {[1, 2, 3, 4, 5].map(i => (
                        <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '1rem' }}>#INF-{202300 + i}</td>
                            <td style={{ padding: '1rem' }}>Proyecto Demo {i}</td>
                            <td style={{ padding: '1rem' }}><span style={{ backgroundColor: '#def7ec', color: '#03543f', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>Completado</span></td>
                            <td style={{ padding: '1rem' }}>2023-10-{10+i}</td>
                            <td style={{ padding: '1rem' }}>
                                <button style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>Ver</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </main>
    </div>
  );
};

export default Informes;
