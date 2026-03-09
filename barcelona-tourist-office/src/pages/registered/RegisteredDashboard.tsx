import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { MockDB, BookingDB } from '../../services/mockDatabase'; // Importar DB

const RegisteredDashboard: React.FC = () => {
    const { user } = useAuthStore();
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');

    const { data: bookings, isLoading } = useQuery({
        queryKey: ['myBookings', user?.id],
        queryFn: () => {
             if (!user) return Promise.resolve([]);
             return MockDB.getUserBookings(user.id); // Usar DB real
        },
        enabled: !!user
    });

    const cancelMutation = useMutation({
        mutationFn: async (bookingId: string) => {
            return MockDB.cancelBooking(bookingId); // Llamada a DB real
        },
        onSuccess: () => {
            alert('Reserva cancelada correctamente');
            // Recargamos los datos
            queryClient.invalidateQueries({ queryKey: ['myBookings'] });
        }
    });

    // Lógica de Filtrado y Ordenamiento
    const processedBookings = useMemo(() => {
        if (!bookings) return [];
        
        // 1. Filtrar
        const filtered = bookings.filter(b => filter === 'all' || b.status === filter);
        
        // 2. Ordenar: Confirmadas arriba, Canceladas abajo
        return filtered.sort((a, b) => {
             if (a.status === b.status) return 0;
             return a.status === 'confirmed' ? -1 : 1;
        });
    }, [bookings, filter]);

    const handlePrint = (booking: BookingDB) => {
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
            
            {/* Controles de Filtro */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                <button 
                    onClick={() => setFilter('all')}
                    style={{ 
                        padding: '0.5rem 1rem', 
                        borderRadius: '20px', 
                        border: '1px solid #ddd',
                        background: filter === 'all' ? '#333' : 'white',
                        color: filter === 'all' ? 'white' : '#333',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Todas
                </button>
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
            
            <div className="booking-list">
                {processedBookings.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '2rem', background: '#f9f9f9', borderRadius: '8px' }}>
                        <p>No hay reservas con este filtro.</p>
                        {filter === 'all' && <p style={{ fontSize: '0.9rem', color: '#666' }}>Ve a la sección 'Actividades' para reservar.</p>}
                    </div>
                )}
                
                {processedBookings.map(booking => (
                    <div key={booking.id} style={{ 
                        border: '1px solid #ddd', 
                        padding: '1.5rem', 
                        borderRadius: '8px', 
                        background: booking.status === 'cancelled' ? '#f3f4f6' : 'white',
                        opacity: booking.status === 'cancelled' ? 0.75 : 1,
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
