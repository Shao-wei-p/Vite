import React, { useState, useMemo } from 'react';
// TanStack Query:
// useQuery: Para OBTENER datos (GET).
// useMutation: Para MODIFICAR datos (POST, PUT, DELETE).
// useQueryClient: Para interactuar con la caché global (invalidarla).
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; 
import { useNavigate } from 'react-router-dom'; // Hook para navegación programática (cambiar de URL).
import { useAuthStore } from '../store/authStore'; // Nuestro store de Zustand para saber quién es el usuario.
import { Activity } from '../types';
import WeatherAside from '../components/WeatherAside';
import { MockDB } from '../services/mockDatabase'; // API simulada.

// Función Fetcher: Es la función que realmente va a buscar los datos.
// TanStack Query llamará a esta función cuando lo necesite.
const fetchActivities = async (): Promise<Activity[]> => {
    // Simulamos un retraso extra aquí (opcional, MockDB ya tiene uno).
    await new Promise(r => setTimeout(r, 600)); 
    return MockDB.getActivities();
};

const Activities: React.FC = () => {
    // Obtenemos el usuario actual desde Zustand.
    const { user } = useAuthStore();
    const navigate = useNavigate();
    // queryClient nos permite decirle a React Query "oye, estos datos ya son viejos, recárgalos".
    const queryClient = useQueryClient(); 
    
    // Estado local de React (useState) para los filtros de la interfaz.
    // Esto es "Client State" efímero. Si recargas la página, se pierde el filtro.
    const [searchText, setSearchText] = useState('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    
    // --- USO DE USEQUERY ---
    // 1. queryKey: ['activities'] es el identificador único de estos datos en la caché.
    // 2. queryFn: fetchActivities es la función que se ejecuta.
    // 3. isLoading: true mientras se obtienen los datos por primera vez.
    // 4. isError: true si la promesa falla (reject).
    const { data: activities, isLoading, isError } = useQuery({
        queryKey: ['activities'],
        queryFn: fetchActivities,
    });

    // Validar reservas existentes:
    // Hacemos otra query para saber qué ha reservado este usuario.
    // enabled: !!user significa "Solo ejecuta esta query si 'user' existe".
    const { data: myBookings } = useQuery({
        queryKey: ['myBookings', user?.id], // La key incluye el ID para que sea única por usuario.
        queryFn: () => user ? MockDB.getUserBookings(user.id) : Promise.resolve([]),
        enabled: !!user
    });

    // --- USO DE USEMEMO ---
    // Optimizamos el filtrado. React solo recalculará 'filteredActivities' si
    // 'activities', 'searchText' o 'maxPrice' cambian. Evita cálculos innecesarios en cada render.
    const filteredActivities = useMemo(() => {
        if (!activities) return []; // Si aún no hay datos, retornamos array vacío.
        return activities.filter(act => {
            // Lógica de filtrado insensible a mayúsculas/minúsculas
            const matchesText = act.title.toLowerCase().includes(searchText.toLowerCase());
            // Lógica de precio máximo
            const matchesPrice = maxPrice === '' || act.price <= Number(maxPrice);
            return matchesText && matchesPrice;
        });
    }, [activities, searchText, maxPrice]); // Array de dependencias

    // --- USO DE USEMUTATION ---
    // Configura una acción que modifica datos en el servidor (crear reserva).
    const reserveMutation = useMutation({
        mutationFn: async (activity: Activity) => {
            if (!user) throw new Error("Usuario no logueado");
            // Llamamos a la API simulada
            return MockDB.createBooking(user.id, activity);
        },
        onSuccess: (data) => {
            // Callback si todo sale bien:
            alert(`¡Reserva confirmada! ID: ${data.id}. Puedes verla en tu panel.`);
            // IMPORTANTE: Invalidamos la caché de 'myBookings'.
            // Esto fuerza a React Query a volver a pedir las reservas del usuario automáticamente,
            // así el botón cambiará de "Reservar" a "Ya Reservado" sin recargar la página.
            queryClient.invalidateQueries({ queryKey: ['myBookings'] }); 
        },
        onError: () => {
            alert("Error al procesar la reserva.");
        }
    });

    // Manejador del click en el botón reservar
    const handleReservation = (act: Activity) => {
        if (window.confirm(`¿Quieres reservar "${act.title}" por ${act.price}€?`)) {
            // Ejecutamos la mutación
            reserveMutation.mutate(act);
        }
    };

    // Renderizado condicional para estados de carga y error
    if (isLoading) return <div className="p-8 text-center">Cargando experiencias...</div>;
    if (isError) return <div className="p-8 text-center text-red-500">Error al cargar actividades.</div>;

    return (
        <div className="activity-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', padding: '2rem' }}>
            <main>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h1 className="text-2xl font-bold" style={{ margin: 0 }}>Actividades en Barcelona</h1>
                    
                    {/* UI de Filtros: inputs controlados vinculados al estado local */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input 
                            type="text" 
                            placeholder="Buscar actividad..." 
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)} // Actualiza el state en cada tecla
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
                    {/* Renderizado de lista: Si el array está vacío, mostramos mensaje */}
                    {filteredActivities.length === 0 && (
                        <p style={{ color: '#666', fontStyle: 'italic' }}>No se encontraron actividades con los filtros seleccionados.</p>
                    )}

                    {/* Mapeo del array a componentes visuales */}
                    {filteredActivities.map((act) => {
                        // Verificamos "al vuelo" si esta actividad ya está en mis reservas
                        const isBooked = myBookings?.some(b => b.activityId === act.id && b.status === 'confirmed');

                        return (
                            <div key={act.id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
                                {/* ...existing code... (UI de la tarjeta) */}
                                <div style={{ fontSize: '2rem' }}>{act.image}</div>
                                <h3 className="font-bold text-xl">{act.title}</h3>
                                <p className="text-gray-600 my-2">{act.description}</p>
                                <div className="font-bold text-lg mb-4">{act.price === 0 ? 'Gratis' : `${act.price}€`}</div>

                                {/* Lógica Condicional del Botón Según Rol y Estado */}
                                {user?.role === 'registered' ? (
                                    <button 
                                        onClick={() => handleReservation(act)} 
                                        // Deshabilitamos si se está enviando (isPending) o ya está reservado
                                        disabled={reserveMutation.isPending || isBooked}
                                        style={{ 
                                            background: isBooked ? '#22c55e' : (reserveMutation.isPending ? '#666' : '#000'), 
                                            color: '#fff', 
                                            // ...existing code...
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
                                    /* Si es admin o worker, mostramos aviso en vez de botón */
                                    <div className="text-gray-500 bg-gray-100 p-2 rounded text-center text-sm border border-gray-200">
                                        {user.role === 'admin' || user.role === 'worker' 
                                            ? '🔒 Modo Gestión (No puedes reservar)' 
                                            : `Rol ${user.role} no permite reservas`}
                                    </div>
                                ) : (
                                    /* Si no hay usuario, botón para ir al login */
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
                {/* Componente reutilizable del Clima */}
                <WeatherAside />
                <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
                   {/* ...existing code... */}
                </div>
            </aside>
        </div>
    );
};

export default Activities;
