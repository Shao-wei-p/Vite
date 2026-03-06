import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Páginas Públicas
import Home from './pages/Home';
import Activities from './pages/Activities'; // Nueva página
import Login from './pages/Login'; // Nueva página
import Contact from './pages/Contact'; // Nueva página (o integrada)
import Events from './pages/Events'; // Importar la nueva página
// Páginas Privadas
import Dashboard from './pages/Dashboard'; // Dashboard Usuario Registrado
import ManagementPanel from './pages/ManagementPanel';
import AdminPanel from './pages/AdminPanel';

// Componentes simples (About/Location) integrados para brevedad académica
const About = () => <div className="p-10 text-center"><h1>🏢 Sobre Nosotros</h1><p>Desde 1990 promocionando Valencia.</p></div>;
const Location = () => (
  <div className="p-10 text-center">
    <h1>📍 Ubicación</h1>
    <div className="bg-gray-300 w-full h-64 mt-4 flex items-center justify-center rounded">Map Placeholder</div>
  </div>
);

function App() {
  return (
    <div className="min-h-screen font-sans bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-grow">
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/events" element={<Events />} /> {/* Ruta Actualizada */}
          <Route path="/about" element={<About />} />
          <Route path="/location" element={<Location />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          
          {/* Rutas Protegidas (RBAC) */}
          <Route path="/dashboard" element={
              <ProtectedRoute requiredRole="registered">
                  <Dashboard />
              </ProtectedRoute>
          } />
          
          <Route path="/management" element={
              <ProtectedRoute requiredRole="worker">
                  <ManagementPanel />
              </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                  <AdminPanel />
              </ProtectedRoute>
          } />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;
