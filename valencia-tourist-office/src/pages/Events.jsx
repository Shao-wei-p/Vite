import React from 'react';
import { useData } from '../context/DataContext';

const Events = () => {
    const { events } = useData();

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h1 className="text-center">Agenda Cultural</h1>
            <p className="text-center text-gray-500 mb-12">
                Conciertos, fiestas tradicionales y exposiciones en Valencia.
            </p>

            <div className="space-y-6">
                {events.length === 0 ? (
                    <p className="text-center text-gray-400">No hay eventos programados.</p>
                ) : (
                    events.map(evt => (
                        <div key={evt.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border-l-8 border-green-500 flex flex-col md:flex-row">
                            {/* Fecha */}
                            <div className="bg-green-50 p-6 flex flex-col items-center justify-center min-w-[150px] border-r border-green-100">
                                <span className="text-3xl font-bold text-green-600">{evt.date.split('-')[2]}</span>
                                <span className="text-sm uppercase font-bold text-green-800">
                                    {new Date(evt.date).toLocaleString('es-ES', { month: 'long' })}
                                </span>
                                <span className="text-xs text-gray-500">{evt.date.split('-')[0]}</span>
                            </div>

                            {/* Detalles */}
                            <div className="p-6 flex-grow flex flex-col justify-center">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-2xl font-bold text-gray-800">{evt.title}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        evt.status === 'Programado' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
                                    }`}>
                                        {evt.status}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-1 flex items-center gap-2">
                                    <span>📍</span> {evt.location}
                                </p>
                            </div>

                            {/* Botón Acción (Decorativo) */}
                            <div className="p-6 flex items-center justify-center bg-gray-50">
                                <button className="btn-secondary text-sm py-1 px-4">
                                    + Info
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Events;
