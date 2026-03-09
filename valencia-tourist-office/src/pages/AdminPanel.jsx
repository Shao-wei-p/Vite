import React from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

const ManagementPanel = () => {
    const { user } = useAuth();
    const { activities, deleteActivity, addActivity, events, addEvent, deleteEvent, messages} = useData();

    // Handlers para añadir datos simulados rápidamente
    const handleAddActivity = () => {
        const title = prompt("Título de la actividad:");
        if (title) addActivity({ title, desc: "Nueva actividad creada", price: 35, image: "🆕" });
    };

    const handleAddEvent = () => {
        const title = prompt("Nombre del evento:");
        if (title) addEvent({ 
            title, 
            date: new Date().toISOString().split('T')[0], 
            location: "Valencia Centro", 
            status: "Programado" 
        });
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-center mb-10">🛠️ Panel de Gestión</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* GESTIÓN DE ACTIVIDADES */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-green-700 m-0">🚣 Actividades</h2>
                        <button onClick={handleAddActivity} className="btn-primary py-1 px-3 text-sm">
                            + Añadir
                        </button>
                    </div>
                    <ul className="space-y-3">
                        {activities.map(act => (
                            <li key={act.id} className="flex justify-between items-center p-3 bg-gray-50 rounded border hover:bg-white transition">
                                <span className="font-medium">{act.title}</span>
                                <button onClick={() => deleteActivity(act.id)} className="text-red-500 hover:text-red-700 text-sm font-bold">
                                    Eliminar
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* GESTIÓN DE EVENTOS*/}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-purple-700 m-0">📅 Eventos</h2>
                        <button onClick={handleAddEvent} className="btn-primary bg-purple-600 hover:bg-purple-700 py-1 px-3 text-sm">
                            + Añadir
                        </button>
                    </div>
                    <ul className="space-y-3">
                        {events.map(evt => (
                            <li key={evt.id} className="flex justify-between items-center p-3 bg-gray-50 rounded border hover:bg-white transition">
                                <div>
                                    <span className="font-medium block">{evt.title}</span>
                                    <span className="text-xs text-gray-500">{evt.date} - {evt.location}</span>
                                </div>
                                <button onClick={() => deleteEvent(evt.id)} className="text-red-500 hover:text-red-700 text-sm font-bold">
                                    Eliminar
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                {(user?.role === 'admin') && (
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-purple-700 m-0">Mensajes Recibidos:</h2>
                    </div>
                    <ul className="space-y-3">
                        {messages.map((m, i) => <li key={i} className="border-b p-2">{m.from}: {m.text}</li>)}</ul>
                </div>
                )}

            </div>
        </div>
    );
};

export default ManagementPanel;
