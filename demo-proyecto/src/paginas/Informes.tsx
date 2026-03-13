import React from 'react';

interface InformesPageProps {
  userRole: string;
}

const Informes: React.FC<InformesPageProps> = ({ userRole }) => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ margin: 0 }}>Lista Global de Informes</h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
              <input type="text" placeholder="Buscar informe..." style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }} />
              {userRole !== 'viewer' && (
                  <button style={{ backgroundColor: '#28a745', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      + Nuevo Informe
                  </button>
              )}
          </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <tr>
                      <th style={{ padding: '1rem' }}>ID</th>
                      <th style={{ padding: '1rem' }}>Nombre</th>
                      <th style={{ padding: '1rem' }}>Proyecto</th>
                      <th style={{ padding: '1rem' }}>Generado por</th>
                      <th style={{ padding: '1rem' }}>Fecha</th>
                      <th style={{ padding: '1rem' }}>Acciones</th>
                  </tr>
              </thead>
              <tbody>
                  {[1, 2, 3, 4, 5].map(i => (
                      <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '1rem' }}>#INF-{202300 + i}</td>
                          <td style={{ padding: '1rem' }}>Reporte Mensual {i}</td>
                          <td style={{ padding: '1rem' }}>Proyecto Alpha</td>
                          <td style={{ padding: '1rem' }}>Usuario Demo</td>
                          <td style={{ padding: '1rem' }}>2023-10-{10+i}</td>
                          <td style={{ padding: '1rem' }}>
                              <button style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px' }}>Ver</button>
                              {userRole !== 'viewer' && <button style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}>PDF</button>}
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
    </div>
  );
};

export default Informes;
