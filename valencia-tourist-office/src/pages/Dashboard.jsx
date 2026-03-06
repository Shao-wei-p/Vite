import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const Dashboard = () => {
    const { user } = useAuth();
    const { reservations, activities, cancelReservation } = useData();

    // FILTRADO: Recuperar solo las reservas de este usuario
    const myReservations = reservations
        .filter(res => res.userId === user.id)
        .map(res => {
            // Unir datos de reserva con detalles de la actividad
            const activityDetails = activities.find(a => a.id === res.activityId);
            return { ...res, ...activityDetails };
        });

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">👋 Hola, {user.username}</h2>
            <p className="text-gray-600 mb-8">Gestiona tus próximas experiencias en Valencia.</p>

            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold border-b pb-4 mb-4">🎟️ Mis Reservas Activas</h3>
                
                {myReservations.length === 0 ? (
                    <p className="text-center py-10 text-gray-400">No tienes actividades reservadas aún.</p>
                ) : (
                    <div className="space-y-4">
                        {myReservations.map((item, index) => (
                            <div key={index} className="flex flex-col md:flex-row justify-between items-center border p-4 rounded-lg hover:bg-gray-50">
                                <div>
                                    <h4 className="font-bold text-lg text-orange-600">{item.title || "Actividad eliminada"}</h4>
                                    <p className="text-sm text-gray-500">Fecha de reserva: {item.date}</p>
                                </div>
                                <div className="flex gap-2 mt-4 md:mt-0">
                                    <button 
                                        onClick={() => alert(`🖨️ IMPRIMIENDO COMPROBANTE...\nActividad: ${item.title}\nUsuario: ${user.username}`)}
                                        className="bg-blue-100 text-blue-700 px-4 py-2 rounded text-sm font-bold hover:bg-blue-200"
                                    >
                                        Imprimir Ticket
                                    </button>
                                    <button 
                                        onClick={() => {
                                            if(window.confirm("¿Seguro que quieres cancelar esta reserva?")) {
                                                cancelReservation(user.id, item.id);
                                            }
                                        }}
                                        className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm font-bold hover:bg-red-200"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
