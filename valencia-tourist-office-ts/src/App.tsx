import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Card } from './components/Card';
import { Footer } from './components/Footer'; // Importamos Footer
import { Home, About, Location, Contact } from './pages/Public';
import { UserDashboard, WorkerDashboard, AdminDashboard } from './pages/Dashboards';
import { Login } from './pages/Login';
import './App.css';

// Página de Actividades
const ActivitiesPage: React.FC = () => {
    const { activities, toggleBooking, users } = useData();
    const { user } = useAuth();
    
    // Verificamos si el usuario actual ya tiene reservada la actividad
    const currentUser = users.find(u => u.id === user?.id);

    const handleAction = (id: number) => {
        if (!user || user.role === 'visitor') {
            alert('Por favor, regístrate para reservar.');
            return;
        }
        toggleBooking(user.id, id);
    };

    return (
        <div className="page-container">
            <h1>Actividades Disponibles</h1>
            <div className="grid-layout">
                {activities.map(act => {
                    const isReserved = currentUser?.bookings?.includes(act.id);
                    return (
                        <Card 
                            key={act.id} 
                            item={act} 
                            onAction={handleAction}
                            actionLabel={isReserved ? 'Cancelar Reserva' : 'Reservar'} 
                        />
                    );
                })}
            </div>
        </div>
    );
};

// Página de Eventos
const EventsPage: React.FC = () => {
    const { events } = useData();
    return (
        <div className="page-container">
            <h1>Eventos Culturales</h1>
            <div className="events-list">
                {events.map(ev => (
                    <div key={ev.id} className="event-card">
                        <h3>{ev.title}</h3>
                        <p>Fecha: {ev.date}</p>
                        <p>Aforo: {ev.registered} / {ev.capacity}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Componente de ruta protegida
const PrivateRoute = ({ children, requiredRole }: { children: JSX.Element, requiredRole?: string }) => {
  const { user, hasPermission } = useAuth();
  if (!user) return <Navigate to="/login" />;
  // Validación estricta si se requiere
  // if (requiredRole && !hasPermission(requiredRole as any)) return <Navigate to="/" />;
  return children;
};

const App: React.FC = () => {
  return (
    <DataProvider>
        <AuthProvider>
            <div className="app-wrapper">
                <Navbar />
                <div className="content-wrap">
                    <Routes>
                        {/* Rutas Públicas */}
                        <Route path="/" element={<Home />} />
                        <Route path="/activities" element={<ActivitiesPage />} />
                        <Route path="/events" element={<EventsPage />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/location" element={<Location />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/login" element={<Login />} />

                        {/* Rutas Privadas / Dashboards */}
                        <Route path="/profile" element={
                            <PrivateRoute><UserDashboard /></PrivateRoute>
                        } />
                        <Route path="/manage" element={
                            <PrivateRoute><WorkerDashboard /></PrivateRoute>
                        } />
                        <Route path="/admin" element={
                            <PrivateRoute><AdminDashboard /></PrivateRoute>
                        } />
                    </Routes>
                </div>
                <Footer />
            </div>
        </AuthProvider>
    </DataProvider>
  );
};

export default App;
