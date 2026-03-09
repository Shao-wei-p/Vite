import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';

// Pages Imports
import Home from './pages/Home'; // Nuevo Import
import Activities from './pages/Activities';
import Events from './pages/Events';
import About from './pages/About';
import Location from './pages/Location';
import Contact from './pages/Contact';

// Auth Imports
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Recovery from './pages/auth/Recovery';

// Dashboard Imports
import WorkerDashboard from './pages/worker/WorkerDashboard';
import RegisteredDashboard from './pages/registered/RegisteredDashboard';
import AdminDashboard from './pages/admin/AdminDashboard'; // Importar AdminDashboard
import ProtectedRoute from './components/ProtectedRoute';

// Configuración de TanStack Query
const queryClient = new QueryClient();

const DashboardSelector = () => {
    const role = useAuthStore(s => s.user?.role);
    
    if (role === 'registered') return <RegisteredDashboard />;
    if (role === 'admin') return <AdminDashboard />; // Redirigir admin direct

    return <div style={{ padding: '2rem' }}><h1>Bienvenido a tu panel personal ({role})</h1></div>;
};

const App: React.FC = () => {
    const { user, logout } = useAuthStore();

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <nav style={{ padding: '1rem', background: '#333', color: '#fff', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <Link to="/" style={{ color: '#fff' }}>Home</Link>
                        <Link to="/activities" style={{ color: '#fff' }}>Actividades</Link>
                        <Link to="/events" style={{ color: '#fff' }}>Eventos</Link>
                        <Link to="/about" style={{ color: '#fff' }}>About</Link>
                        <Link to="/location" style={{ color: '#fff' }}>Ubicación</Link>
                        <Link to="/contact" style={{ color: '#fff' }}>Contacto</Link>
                        
                        {/* Botón dinámico al Dashboard según Rol */}
                        {user && (
                            <Link 
                                to={user.role === 'worker' ? '/worker-tools' : user.role === 'admin' ? '/admin-settings' : '/panel'} 
                                style={{ color: '#fff', fontWeight: 'bold', background: '#2563eb', padding: '0.25rem 0.75rem', borderRadius: '4px' }}
                            >
                                {user.role === 'worker' ? 'Panel Worker' : user.role === 'admin' ? 'Panel Admin' : 'Mi Cuenta'}
                            </Link>
                        )}

                        <div style={{ marginLeft: 'auto' }}>
                            {user ? (
                                <span>Hola, {user.username} <button onClick={logout} style={{ marginLeft: '10px' }}>Salir</button></span>
                            ) : (
                                <Link to="/login" style={{ color: '#fff' }}>Login</Link>
                            )}
                        </div>
                    </nav>

                    <div style={{ flex: 1 }}>
                        <Routes>
                            {/* Rutas Públicas */}
                            <Route path="/" element={<Home />} /> {/* Cambiado de elemento inline a componente Home */}
                            <Route path="/activities" element={<Activities />} />
                            <Route path="/events" element={<Events />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/location" element={<Location />} />
                            <Route path="/contact" element={<Contact />} />
                            
                            {/* Rutas Auth */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/recovery" element={<Recovery />} />

                            {/* Rutas Privadas / Dashboards */}
                            <Route element={<ProtectedRoute allowedRoles={['registered', 'worker', 'admin']} />}>
                                <Route path="/panel" element={<DashboardSelector />} />
                            </Route>

                            <Route element={<ProtectedRoute allowedRoles={['worker', 'admin']} />}>
                                <Route path="/worker-tools" element={<WorkerDashboard />} />
                            </Route>

                            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                                <Route path="/admin-settings" element={<AdminDashboard />} />
                            </Route>
                        </Routes>
                    </div>

                    <footer style={{ background: '#1f2937', color: '#9ca3af', padding: '2rem', marginTop: 'auto' }}>
                        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                            <div>
                                <h4 style={{ color: '#fff', marginBottom: '1rem' }}>Barcelona Turisme</h4>
                                <p style={{ fontSize: '0.9rem' }}>La guía oficial para descubrir nuestra ciudad.</p>
                            </div>
                            <div>
                                <h4 style={{ color: '#fff', marginBottom: '1rem' }}>Enlaces Rápidos</h4>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    <li><Link to="/activities" style={{ color: '#9ca3af' }}>Actividades</Link></li>
                                    <li><Link to="/events" style={{ color: '#9ca3af' }}>Agenda Cultural</Link></li>
                                    <li><Link to="/contact" style={{ color: '#9ca3af' }}>Contacto</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 style={{ color: '#fff', marginBottom: '1rem' }}>Legal</h4>
                                <p style={{ fontSize: '0.9rem' }}>
                                    &copy; {new Date().getFullYear()} Oficina de Turismo.<br/>
                                    Todos los derechos reservados.
                                </p>
                            </div>
                        </div>
                    </footer>
                </div>
            </BrowserRouter>
        </QueryClientProvider>
    );
};

export default App;
