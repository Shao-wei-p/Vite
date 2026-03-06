import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';

const Activities = () => {
    const { user } = useAuth();
    const { activities, makeReservation } = useData();
    const navigate = useNavigate();

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-center font-bold text-gray-800">Catálogo de Experiencias</h1>
            <p className="text-center text-gray-500 mb-10">Descubre lo mejor de Valencia con nosotros</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {activities.map(act => (
                    <div key={act.id} className="card">
                        <div className="card-header">
                            {act.image}
                        </div>
                        <div className="card-body">
                            <h3 className="card-title">{act.title}</h3>
                            <p className="mb-4 flex-grow text-sm text-gray-600">{act.desc}</p>
                            <div className="card-price">{act.price}€</div>
                            
                            {user?.role === 'registered' ? (
                                <button onClick={() => makeReservation(user.id, act.id)} className="btn-primary w-full">
                                    Reservar Plaza
                                </button>
                            ) : user ? (
                                <div className="text-center p-2 bg-gray-100 text-gray-500 rounded text-sm">
                                    Vista de {user.role}
                                </div>
                            ) : (
                                <button onClick={() => navigate('/login')} className="btn-secondary w-full">
                                    Login para Reservar
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Activities;
