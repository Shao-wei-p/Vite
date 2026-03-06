import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

// Dashboard Usuario Registrado
export const UserDashboard: React.FC = () => {
    const { user } = useAuth();
    const { activities, toggleBooking, users } = useData(); // Necesitamos la lista actualizada de usuarios para ver los bookings

    // Buscar al usuario actual en la "BD" para tener sus bookings actualizados
    const currentUserData = users.find(u => u.id === user?.id);
    const myBookings = activities.filter(a => currentUserData?.bookings?.includes(a.id));

    const handlePrint = (title: string) => {
        alert(`Imprimiendo comprobante para: ${title}...`);
    };

    return (
        <div className="page-container">
            <h2>Mis Reservas</h2>
            {myBookings.length === 0 ? <p>No tienes reservas activas.</p> : (
                <ul className="dashboard-list">
                    {myBookings.map(act => (
                        <li key={act.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{act.title} - {act.date || 'Fecha abierta'}</span>
                            <div>
                                <button onClick={() => handlePrint(act.title)} style={{ marginRight: '5px' }}>🖨️ Imprimir</button>
                                <button onClick={() => toggleBooking(user!.id, act.id)} style={{ background: '#ff6b6b', color: 'white' }}>Cancelar</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// Dashboard Trabajador
export const WorkerDashboard: React.FC = () => {
    const { activities, events, addActivity, deleteActivity, addEvent, deleteEvent, users } = useData();

    const handleAddActivity = () => {
        const title = prompt("Título de la actividad:");
        if (!title) return;
        const price = prompt("Precio (€):");
        const desc = prompt("Descripción:");
        
        addActivity({
            id: Date.now(),
            title,
            description: desc || "",
            price: Number(price) || 0,
            image: "https://via.placeholder.com/300x200?text=Nueva+Actividad"
        });
    };

    const handleAddEvent = () => {
        const title = prompt("Título del evento:");
        if (!title) return;
        const date = prompt("Fecha (YYYY-MM-DD):");
        const capacity = prompt("Aforo máximo:");
        
        addEvent({
            id: Date.now(),
            title,
            date: date || new Date().toISOString().split('T')[0],
            capacity: Number(capacity) || 100,
            registered: 0
        });
    };

    return (
        <div className="page-container">
            <h2>Panel de Gestión (Trabajador)</h2>
            
            <section>
                <h3>Gestión de Actividades</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#eee' }}><th>ID</th><th>Título</th><th>Reservas</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                        {activities.map(act => {
                             // Calcular cuántos usuarios han reservado esta actividad
                             const count = users.filter(u => u.bookings?.includes(act.id)).length;
                             return (
                                <tr key={act.id}>
                                    <td>{act.id}</td>
                                    <td>{act.title}</td>
                                    <td>{count} usuarios</td>
                                    <td>
                                        <button onClick={() => deleteActivity(act.id)} style={{ background: '#ff6b6b', color: 'white' }}>Eliminar</button>
                                    </td>
                                </tr>
                             );
                        })}
                    </tbody>
                </table>
                <button onClick={handleAddActivity} style={{ marginTop: '1rem', background: '#41B3A3', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' }}>+ Añadir Actividad</button>
            </section>

            <section style={{ marginTop: '3rem', borderTop: '2px solid #eee', paddingTop: '2rem' }}>
                <h3>Gestión de Eventos</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#eee' }}>
                            <th>Título</th>
                            <th>Fecha</th>
                            <th>Aforo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map(ev => (
                            <tr key={ev.id}>
                                <td>{ev.title}</td>
                                <td>{ev.date}</td>
                                <td>{ev.registered} / {ev.capacity}</td>
                                <td>
                                    <button onClick={() => deleteEvent(ev.id)} style={{ background: '#ff6b6b', color: 'white' }}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={handleAddEvent} style={{ marginTop: '1rem', background: '#E27D60', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' }}>+ Añadir Evento</button>
            </section>
        </div>
    );
};

// Dashboard Admin
export const AdminDashboard: React.FC = () => {
    const { users, messages, deleteUser, markMessageRead } = useData();

    return (
        <div className="page-container">
            <h1 style={{ color: '#C0392B' }}>Panel de Administración Global</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="admin-section">
                    <h3>Usuarios del Sistema</h3>
                    <ul>
                        {users.map(u => (
                            <li key={u.id} style={{ marginBottom: '5px' }}>
                                <strong>{u.username}</strong> ({u.role}) 
                                {u.role !== 'admin' && <button onClick={() => deleteUser(u.id)} style={{ marginLeft: '10px', fontSize: '0.8rem' }}>x</button>}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="admin-section">
                    <h3>Bandeja de Entrada</h3>
                    {messages.length === 0 && <p style={{fontStyle:'italic'}}>No hay mensajes.</p>}
                    {messages.map(msg => (
                        <div key={msg.id} style={{ background: msg.isRead ? '#f9f9f9' : '#fff3cd', padding: '10px', border: '1px solid #ddd', marginBottom: '10px' }}>
                            <small>{msg.email} - {msg.date}</small>
                            <p style={{ margin: '5px 0' }}>{msg.content}</p>
                            {!msg.isRead && <button onClick={() => markMessageRead(msg.id)}>Marcar como leído</button>}
                        </div>
                    ))}
                </div>
            </div>
            {/* Reutilizamos componentes de Worker si quisiéramos o duplicamos lógica para gestión completa */}
        </div>
    );
};
