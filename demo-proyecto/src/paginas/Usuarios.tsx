import React from 'react';

interface UsuariosProps {
  userRole: string;
}

const Usuarios: React.FC<UsuariosProps> = ({ userRole }) => {
  if (!['superAdmin', 'admin'].includes(userRole)) {
    return <div style={{ padding: '20px', color: 'red' }}>No tienes permisos para ver esta página.</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ margin: 0 }}>Gestión de Usuarios</h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
              <input type="text" placeholder="Buscar usuario..." style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }} />
              <button style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  + Nuevo Usuario
              </button>
          </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <tr>
                    <th style={{ padding: '1rem' }}>Nombre</th>
                    <th style={{ padding: '1rem' }}>Email</th>
                    <th style={{ padding: '1rem' }}>Rol</th>
                    <th style={{ padding: '1rem' }}>Estado</th>
                    <th style={{ padding: '1rem' }}>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '1rem' }}>Juan Pérez</td>
                    <td style={{ padding: '1rem' }}>juan@demo.com</td>
                    <td style={{ padding: '1rem' }}>Admin</td>
                    <td style={{ padding: '1rem' }}><span style={{ color: 'green', backgroundColor: '#def7ec', padding: '2px 8px', borderRadius: '10px', fontSize: '0.85rem' }}>Activo</span></td>
                    <td style={{ padding: '1rem' }}><button style={{ cursor: 'pointer', padding: '4px 8px' }}>Editar</button></td>
                </tr>
                <tr>
                    <td style={{ padding: '1rem' }}>Maria López</td>
                    <td style={{ padding: '1rem' }}>maria@demo.com</td>
                    <td style={{ padding: '1rem' }}>Editor</td>
                    <td style={{ padding: '1rem' }}><span style={{ color: 'green', backgroundColor: '#def7ec', padding: '2px 8px', borderRadius: '10px', fontSize: '0.85rem' }}>Activo</span></td>
                    <td style={{ padding: '1rem' }}><button style={{ cursor: 'pointer', padding: '4px 8px' }}>Editar</button></td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default Usuarios;
