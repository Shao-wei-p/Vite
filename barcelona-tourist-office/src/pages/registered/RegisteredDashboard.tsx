import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { MockDB, BookingDB } from '../../services/mockDatabase'; // Importar DB

const RegisteredDashboard: React.FC = () => {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    // Estado local para controlar el filtro visual activo
    const [filter, setFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');

    // Query para obtener MIS reservas
    const { data: bookings, isLoading } = useQuery({
        queryKey: ['myBookings', user?.id], // Key compuesta: esencial para que la caché se separe por usuario.
        queryFn: () => {
             // Protección extra: Si no hay usuario, retornamos array vacío
             if (!user) return Promise.resolve([]);
             return MockDB.getUserBookings(user.id);
        },
        enabled: !!user // La query NO se ejecuta hasta que 'user' exista.
    });

    // Mutación para cancelar
    const cancelMutation = useMutation({
        mutationFn: async (bookingId: string) => {
            return MockDB.cancelBooking(bookingId);
        },
        onSuccess: () => {
            alert('Reserva cancelada correctamente');
            // Invalidación: Fuerza a React Query a refrescar la lista 'myBookings' en segundo plano.
            queryClient.invalidateQueries({ queryKey: ['myBookings'] });
        }
    });

    // Lógica de Computación Derivada (useMemo)
    // Esto es muy eficiente: Filtra y ordena los datos crudos del servidor en el cliente.
    // Solo se recalcula si cambian 'bookings' (nuevos datos del servidor) o 'filter' (interacción del usuario).
    const processedBookings = useMemo(() => {
        if (!bookings) return [];
        
        // 1. Filtrado
        const filtered = bookings.filter(b => filter === 'all' || b.status === filter);
        
        // 2. Ordenamiento (Sort in-place)
        // Retorna -1 si 'a' debe ir antes, 1 si debe ir después.
        return filtered.sort((a, b) => {
             if (a.status === b.status) return 0;
             return a.status === 'confirmed' ? -1 : 1; // Pone las confirmadas primero
        });
    }, [bookings, filter]);

    // Función auxiliar para simular un PDF
    const handlePrint = (booking: BookingDB) => {
        // Template String (backticks) permite saltos de línea y variables integradas.
        const content = `
        ------------------------------------------
             OFICINA DE TURISME DE BARCELONA
                 Comprobante de Reserva
        ------------------------------------------
        Reserva ID: ${booking.id}
        Actividad:  ${booking.activityTitle}
        Fecha:      ${booking.date}
        Precio:     ${booking.price}€
        
        Titular:    ${user?.username} (${user?.email})
        Estado:     ${booking.status.toUpperCase()}
        ------------------------------------------
        `;
        alert(content + "\n(Simulación de impresión PDF)");
    };

    if (isLoading) return <div className="p-8">Cargando tus reservas...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            <h1 className="text-2xl font-bold mb-6">Mis Reservas</h1>
            
            {/* Controles de Filtro Visual */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                <button 
                    onClick={() => setFilter('all')}
                    style={{ 
                        // Estilos condicionales en línea: background cambia según el estado 'filter'
                        background: filter === 'all' ? '#333' : 'white',
                        color: filter === 'all' ? 'white' : '#333',
                        // ...existing code...
                        padding: '0.5rem 1rem', 
                        borderRadius: '20px', 
                        border: '1px solid #ddd',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Todas
                </button>
                {/* ...existing code... (Botones Confirmadas y Canceladas similares) */}
                <button 
                    onClick={() => setFilter('confirmed')}
                    style={{ 
                        padding: '0.5rem 1rem', 
                        borderRadius: '20px', 
                        border: '1px solid #ddd',
                        background: filter === 'confirmed' ? '#166534' : 'white',
                        color: filter === 'confirmed' ? 'white' : '#166534',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Confirmadas
                </button>
                <button 
                    onClick={() => setFilter('cancelled')}
                    style={{ 
                        padding: '0.5rem 1rem', 
                        borderRadius: '20px', 
                        border: '1px solid #ddd',
                        background: filter === 'cancelled' ? '#991b1b' : 'white',
                        color: filter === 'cancelled' ? 'white' : '#991b1b',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Canceladas
                </button>
            </div>
            
            {/* Lista de Resultados */}
            <div className="booking-list">
                {/* Mensaje si no hay resultados tras el filtrado */}
                {processedBookings.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem', background: '#f9f9f9', borderRadius: '8px' }}>
                        <p>No hay reservas con este filtro.</p>
                        {filter === 'all' && <p style={{ fontSize: '0.9rem', color: '#666' }}>Ve a la sección 'Actividades' para reservar.</p>}
                    </div>
                )}
                
                {/* Mapeo de la lista procesada */}
                {processedBookings.map(booking => (
                    <div key={booking.id} style={{ 
                        // Estilos dinámicos: opacidad reducida si está cancelada
                        opacity: booking.status === 'cancelled' ? 0.75 : 1,
                        background: booking.status === 'cancelled' ? '#f3f4f6' : 'white',
                        // ...existing code...
                        border: '1px solid #ddd', 
                        padding: '1.5rem', 
                        borderRadius: '8px', 
                        marginBottom: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        transition: 'all 0.3s'
                    }}>
                        <div>
                            <h3 className="font-bold text-lg">{booking.activityTitle}</h3>
                            <p className="text-sm text-gray-600">Fecha: {booking.date}</p>
                            <span style={{ 
                                display: 'inline-block', 
                                padding: '0.2rem 0.5rem', 
                                borderRadius: '4px', 
                                fontSize: '0.8rem',
                                marginTop: '0.5rem',
                                fontWeight: 'bold',
                                background: booking.status === 'confirmed' ? '#dcfce7' : '#fee2e2',
                                color: booking.status === 'confirmed' ? '#166534' : '#991b1b'
                            }}>
                                {booking.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}
                            </span>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {/* Solo mostramos acciones si la reserva está activa (confirmed) */}
                            {booking.status === 'confirmed' && (
                                <>
                                    <button 
                                        onClick={() => handlePrint(booking)}
                                        style={{ background: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                                    >
                                        Imprimir
                                    </button>
                                    <button 
                                        onClick={() => {
                                            if(window.confirm('¿Seguro que quieres cancelar esta reserva?')) cancelMutation.mutate(booking.id)
                                        }}
                                        style={{ background: 'white', border: '1px solid #ef4444', color: '#ef4444', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Cancelar
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RegisteredDashboard;
