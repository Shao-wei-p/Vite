import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout'; // Importamos Layout
import Home from './paginas/Home';
import Proyectos from './paginas/Proyectos';
import Informes from './paginas/Informes';
import Usuarios from './paginas/Usuarios';
import DetalleProyecto from './paginas/DetalleProyecto';
import Login from './components/Login';

function App() {
  // Inicializar estado buscando en localStorage para no perder la sesión al recargar
  const [user, setUser] = useState<{ role: string; name: string } | null>(() => {
    const savedUser = localStorage.getItem('app_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (role: string) => {
    const newUser = { role, name: 'Usuario Demo' };
    setUser(newUser);
    localStorage.setItem('app_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('app_user');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/app" />} 
        />

        {/* Rutas Protegidas envueltas en Layout */}
        {user ? (
          <Route element={<Layout userRole={user.role} onLogout={handleLogout} />}>
             {/* Redirección específica para Viewer */}
            <Route path="/app" element={user.role === 'viewer' ? <Navigate to="/informes" /> : <Home userRole={user.role} />} />
            
            <Route path="/proyectos" element={<Proyectos userRole={user.role} />} />
            <Route path="/proyectos/:id" element={<DetalleProyecto userRole={user.role} />} />
            <Route path="/informes" element={<Informes userRole={user.role} />} />
            <Route path="/usuarios" element={<Usuarios userRole={user.role} />} />
            
            <Route path="*" element={<Navigate to="/app" />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
