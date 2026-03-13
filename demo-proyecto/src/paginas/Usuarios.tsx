import React from 'react';
import Navbar from '../components/Navbar';

interface UsuariosPageProps {
  onLogout: () => void;
  userRole: string;
}

const Usuarios: React.FC<UsuariosPageProps> = ({ onLogout, userRole }) => {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', position: 'fixed', top: 0, left: 0 }}>
      <Navbar onLogout={onLogout} onSettings={() => {}} userRole={userRole} />
      
      <main style={{ flex: 1, padding: '2rem', backgroundColor: '#f3f4f6', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ margin: 0 }}>Gestión de Usuarios</h1>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <input type="text" placeholder="Buscar usuario..." style={{ padding: '0.5rem', border: '1px solid #d1d5db' }} />
                <button style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px' }}>
                    + Nuevo Usuario
                </button>
            </div>
        </div>

        <table style={{ width: '100%', backgroundColor: 'white', borderCollapse: 'collapse', textAlign: 'left', borderRadius: '8px', overflow: 'hidden' }}>
            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <tr>
                    <th style={{ padding: '1rem' }}>Nombre</th>
                    <th style={{ padding: '1rem' }}>Email</th>
                    <th style={{ padding: '1rem' }}>Rol</th>
                    <th style={{ padding: '1rem' }}>Estado</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style={{ padding: '1rem' }}>Admin User</td>
                    <td style={{ padding: '1rem' }}>admin@demo.com</td>
                    <td style={{ padding: '1rem' }}>Admin</td>
                    <td style={{ padding: '1rem' }}>Activo</td>
                </tr>
                <tr>
                    <td style={{ padding: '1rem' }}>Editor User</td>
                    <td style={{ padding: '1rem' }}>editor@demo.com</td>
                    <td style={{ padding: '1rem' }}>Editor</td>
                    <td style={{ padding: '1rem' }}>Activo</td>
                </tr>
            </tbody>
        </table>
      </main>
    </div>
  );
};

export default Usuarios;
