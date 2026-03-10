import React from 'react';
// React Router DOM: Librería estándar para navegación en SPAs (Single Page Applications).
// BrowserRouter: Usa la API de Historia de HTML5 para mantener la UI sincronizada con la URL.
// Routes/Route: Definen el mapeo entre una dirección URL y el componente que se debe mostrar.
// Link: Reemplaza a la etiqueta <a> de HTML. Navega sin recargar la página completa.
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// TanStack Query Setup:
// QueryClient: Es el "cerebro" que gestiona la caché de todas las peticiones.
// QueryClientProvider: Componente que "inyecta" el cliente en toda la app (usando React Context).
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';

// Imports de Páginas (Code Splitting implícito por Vite en el build)
import Home from './pages/Home';
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
import AdminDashboard from './pages/admin/AdminDashboard'; 
import ProtectedRoute from './components/ProtectedRoute';

// Instanciamos el cliente de React Query.
// Aquí se podrían configurar opciones globales (ej: "no reintentar peticiones fallidas").
const queryClient = new QueryClient();

// Componente Helper: Lógica de redirección basada en roles.
// Decide qué dashboard mostrar cuando el usuario entra a "/panel".
const DashboardSelector = () => {
    // Zustand: Obtenemos el rol del usuario actual.
    const role = useAuthStore(s => s.user?.role);
    
    // Renderizado Condicional (Early Return pattern)
    if (role === 'registered') return <RegisteredDashboard />;
    if (role === 'admin') return <AdminDashboard />; 

    // Fallback por si el rol no coincide (ej: worker entra aquí por error)
    return <div style={{ padding: '2rem' }}><h1>Bienvenido a tu panel personal ({role})</h1></div>;
};

const App: React.FC = () => {
    // Zustand: Extraemos función logout y objeto user para la barra de navegación.
    const { user, logout } = useAuthStore();

    return (
        // Provider Global: Envuelve TODA la app para que useQuery funcione en cualquier componente hijo.
        <QueryClientProvider client={queryClient}>
            {/* Router Global: Habilita la navegación SPA */}
            <BrowserRouter>
                {/* Layout Principal: Flexbox vertical para que el Footer siempre quede abajo */}
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    
                    {/* --- HEADER / NAV --- */}
                    <nav style={{ padding: '1rem', background: '#333', color: '#fff', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Enlaces Públicos */}
                        <Link to="/" style={{ color: '#fff' }}>Home</Link>
                        <Link to="/activities" style={{ color: '#fff' }}>Actividades</Link>
                        <Link to="/events" style={{ color: '#fff' }}>Eventos</Link>
                        <Link to="/about" style={{ color: '#fff' }}>About</Link>
                        <Link to="/location" style={{ color: '#fff' }}>Ubicación</Link>
                        <Link to="/contact" style={{ color: '#fff' }}>Contacto</Link>
                        
                        {/* Botón Dinámico al Dashboard: Solo se muestra si hay usuario logueado */}
                        {user && (
                            <Link 
                                // Lógica ternaria anidada para determinar la ruta destino según el rol
                                to={user.role === 'worker' ? '/worker-tools' : user.role === 'admin' ? '/admin-settings' : '/panel'} 
                                style={{ color: '#fff', fontWeight: 'bold', background: '#2563eb', padding: '0.25rem 0.75rem', borderRadius: '4px' }}
                            >
                                {/* Texto del botón dinámico */}
                                {user.role === 'worker' ? 'Panel Worker' : user.role === 'admin' ? 'Panel Admin' : 'Mi Cuenta'}
                            </Link>
                        )}

                        {/* Área de Usuario / Login (A la derecha gracias a marginLeft: auto) */}
                        <div style={{ marginLeft: 'auto' }}>
                            {user ? (
                                <span>Hola, {user.username} <button onClick={logout} style={{ marginLeft: '10px' }}>Salir</button></span>
                            ) : (
                                <Link to="/login" style={{ color: '#fff' }}>Login</Link>
                            )}
                        </div>
                    </nav>

                    {/* --- CONTENIDO PRINCIPAL --- */}
                    <div style={{ flex: 1 }}>
                        <Routes>
                            {/* 1. Rutas Públicas: Accesibles para todos */}
                            <Route path="/" element={<Home />} />
                            <Route path="/activities" element={<Activities />} />
                            <Route path="/events" element={<Events />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/location" element={<Location />} />
                            <Route path="/contact" element={<Contact />} />
                            
                            {/* 2. Rutas de Autenticación */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/recovery" element={<Recovery />} />

                            {/* 3. Rutas Protegidas (Guards) */}
                            {/* ProtectedRoute actúa como "Layout Wrapper". Si no cumple la condición, redirige. */}
                            
                            {/* Grupo 1: Panel General (Para todos los logueados) */}
                            <Route element={<ProtectedRoute allowedRoles={['registered', 'worker', 'admin']} />}>
                                <Route path="/panel" element={<DashboardSelector />} />
                            </Route>

                            {/* Grupo 2: Herramientas de Trabajador (Worker + Admin) */}
                            <Route element={<ProtectedRoute allowedRoles={['worker', 'admin']} />}>
                                <Route path="/worker-tools" element={<WorkerDashboard />} />
                            </Route>

                            {/* Grupo 3: Solo Admin */}
                            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                                <Route path="/admin-settings" element={<AdminDashboard />} />
                            </Route>
                        </Routes>
                    </div>

                    {/* --- FOOTER --- */}
                    <footer style={{ background: '#1f2937', color: '#9ca3af', padding: '2rem', marginTop: 'auto' }}>
                        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                            {/* ...existing code... */}
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
