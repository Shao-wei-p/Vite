import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

interface LayoutProps {
  userRole: string;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ userRole, onLogout }) => {
  return (
    // Layout Flex Horizontal: Navbar a la izquierda, Contenido a la derecha
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Navbar userRole={userRole} onLogout={onLogout} />
      
      {/* Contenedor escrolleable para el contenido principal */}
      <main style={{ 
        flex: 1, 
        padding: '30px', 
        overflowY: 'auto', 
        backgroundColor: '#f3f4f6' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
