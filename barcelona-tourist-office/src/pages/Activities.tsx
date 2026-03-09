import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Añadir useMutation, useQueryClient
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Activity } from '../types';
import WeatherAside from '../components/WeatherAside';
import { MockDB } from '../services/mockDatabase'; // Importar DB

// Mock Fetcher for Activities
const fetchActivities = async (): Promise<Activity[]> => {
    // Usar MockDB en lugar de array hardcoded
    await new Promise(r => setTimeout(r, 600)); 
    return MockDB.getActivities();
};

const Activities: React.FC = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const queryClient = useQueryClient(); // Cliente para invalidar caché
    
    // Estados para filtros
    const [searchText, setSearchText] = useState('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    
    // TanStack Query Fetch
    const { data: activities, isLoading, isError } = useQuery({
        queryKey: ['activities'],
        queryFn: fetchActivities,
    });

    // Validar reservas existentes del usuario para bloquear duplicados
    const { data: myBookings } = useQuery({
        queryKey: ['myBookings', user?.id],
        queryFn: () => user ? MockDB.getUserBookings(user.id) : Promise.resolve([]),
        enabled: !!user
    });

    // Lógica de filtrado
    const filteredActivities = useMemo(() => {
        if (!activities) return [];
        return activities.filter(act => {
            const matchesText = act.title.toLowerCase().includes(searchText.toLowerCase());
            const matchesPrice = maxPrice === '' || act.price <= Number(maxPrice);
            return matchesText && matchesPrice;
        });
    }, [activities, searchText, maxPrice]);

    // Mutación para crear reserva real
    const reserveMutation = useMutation({
        mutationFn: async (activity: Activity) => {
            if (!user) throw new Error("Usuario no logueado");
            return MockDB.createBooking(user.id, activity);
        },
        onSuccess: (data) => {
            alert(`¡Reserva confirmada! ID: ${data.id}. Puedes verla en tu panel.`);
            queryClient.invalidateQueries({ queryKey: ['myBookings'] }); // Refrescar caché de reservas
        },
        onError: () => {
            alert("Error al procesar la reserva.");
        }
    });

    const handleReservation = (act: Activity) => {
        if (window.confirm(`¿Quieres reservar "${act.title}" por ${act.price}€?`)) {
            reserveMutation.mutate(act);
        }
    };

    if (isLoading) return <div className="p-8 text-center">Cargando experiencias...</div>;
    if (isError) return <div className="p-8 text-center text-red-500">Error al cargar actividades.</div>;

    return (
        <div className="activity-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', padding: '2rem' }}>
            <main>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h1 className="text-2xl font-bold" style={{ margin: 0 }}>Actividades en Barcelona</h1>
                    
                    {/* Barra de Filtros */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input 
                            type="text" 
                            placeholder="Buscar actividad..." 
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <input 
                            type="number" 
                            placeholder="Precio máx €" 
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', width: '120px' }}
                        />
                    </div>
                </div>

                <div className="grid gap-6">
                    {filteredActivities.length === 0 && (
                        <p style={{ color: '#666', fontStyle: 'italic' }}>No se encontraron actividades con los filtros seleccionados.</p>
                    )}

                    {filteredActivities.map((act) => {
                        // Comprobar si ya está reservado (activa y confirmada)
                        const isBooked = myBookings?.some(b => b.activityId === act.id && b.status === 'confirmed');

                        return (
                            <div key={act.id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
                                <div style={{ fontSize: '2rem' }}>{act.image}</div>
                                <h3 className="font-bold text-xl">{act.title}</h3>
                                <p className="text-gray-600 my-2">{act.description}</p>
                                <div className="font-bold text-lg mb-4">{act.price === 0 ? 'Gratis' : `${act.price}€`}</div>

                                {user?.role === 'registered' ? (
                                    <button 
                                        onClick={() => handleReservation(act)} 
                                        disabled={reserveMutation.isPending || isBooked}
                                        style={{ 
                                            background: isBooked ? '#22c55e' : (reserveMutation.isPending ? '#666' : '#000'), 
                                            color: '#fff', 
                                            padding: '0.5rem 1rem', 
                                            borderRadius: '4px', 
                                            cursor: (reserveMutation.isPending || isBooked) ? 'not-allowed' : 'pointer',
                                            width: '100%',
                                            border: 'none',
                                            fontWeight: isBooked ? 'bold' : 'normal'
                                        }}
                                    >
                                        {isBooked ? '✓ Ya Reservado' : (reserveMutation.isPending ? 'Procesando...' : 'Reservar Plaza')}
                                    </button>
                                ) : user ? (
                                    <div className="text-gray-500 bg-gray-100 p-2 rounded text-center text-sm border border-gray-200">
                                        {user.role === 'admin' || user.role === 'worker' 
                                            ? '🔒 Modo Gestión (No puedes reservar)' 
                                            : `Rol ${user.role} no permite reservas`}
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => navigate('/login')}
                                        style={{ background: 'transparent', border: '1px solid #000', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Inicia sesión para reservar
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </main>
            
            <aside>
                <WeatherAside />
                <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
                    <h4 className="font-bold mb-2">Info Turística</h4>
                    <p className="text-sm">Oficina abierta de 09:00 a 20:00.</p>
                </div>
            </aside>
        </div>
    );
};

export default Activities;
