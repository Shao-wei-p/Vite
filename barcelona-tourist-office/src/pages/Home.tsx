import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom'; // Para crear enlaces internos SPA (sin recarga completa).
import { MockDB } from '../services/mockDatabase';
import WeatherAside from '../components/WeatherAside';

const Home: React.FC = () => {
    // Queries Paralelas:
    // React Query dispara estas dos peticiones al mismo tiempo. No espera a que termine una para empezar la otra.
    // alias { data: activities }: Renombramos 'data' a 'activities' para evitar conflicto de nombres.
    const { data: activities } = useQuery({ queryKey: ['activities'], queryFn: MockDB.getActivities });
    const { data: events } = useQuery({ queryKey: ['events'], queryFn: MockDB.getEvents });

    // JS Array Logic: slice(0, X) toma los primeros X elementos.
    // El '?' es importante porque al inicio 'activities' es undefined (cargando).
    const popularActivities = activities?.slice(0, 3);
    const popularEvents = events?.slice(0, 2);

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Grid Layout CSS para estructura principal y barra lateral */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '3rem' }}>
                <main>
                    <section style={{ marginBottom: '3rem', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1a1a1a' }}>Descubre Barcelona</h1>
                        <p style={{ fontSize: '1.1rem', color: '#666' }}>Viu la ciutat, siente la magia. Tu aventura comienza aquí.</p>
                    </section>

                    {/* Sección Actividades Populares */}
                    <section style={{ marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', borderLeft: '4px solid #2563eb', paddingLeft: '1rem' }}>Actividades Populares</h2>
                            <Link to="/activities" style={{ color: '#2563eb', fontWeight: '600' }}>Ver todas &rarr;</Link>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            {/* Mapeo de datos a UI */}
                            {popularActivities?.map(act => (
                                <Link key={act.id} to="/activities" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div style={{ border: '1px solid #eee', borderRadius: '12px', padding: '1.5rem', transition: 'box-shadow 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', background: 'white' }}>
                                        {/* Renderizamos el emoji de la imagen */}
                                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{act.image}</div>
                                        <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{act.title}</h3>
                                        {/* substring: cortamos la descripción si es muy larga para la tarjeta */}
                                        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>{act.description?.substring(0, 50)}...</p>
                                        <span style={{ fontWeight: 'bold', color: '#2563eb' }}>{act.price === 0 ? 'Gratis' : `${act.price}€`}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Sección Próximos Eventos */}
                    <section>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', borderLeft: '4px solid #b91c1c', paddingLeft: '1rem' }}>Agenda Cultural</h2>
                            <Link to="/events" style={{ color: '#b91c1c', fontWeight: '600' }}>Ver calendario &rarr;</Link>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                            {popularEvents?.map(evt => (
                                <div key={evt.id} style={{ display: 'flex', alignItems: 'center', border: '1px solid #eee', borderRadius: '8px', padding: '1rem', background: '#fff' }}>
                                    {/* Formateo de fechas con JS nativo: 'short' -> 'Sep', 'Oct' */}
                                    <div style={{ background: '#fef2f2', padding: '0.5rem 1rem', borderRadius: '6px', textAlign: 'center', marginRight: '1rem', color: '#b91c1c' }}>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{new Date(evt.date).toLocaleString('default', { month: 'short' }).toUpperCase()}</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{new Date(evt.date).getDate()}</div>
                                    </div>
                                    <div>
                                        <h3 style={{ fontWeight: 'bold', margin: 0 }}>{evt.title}</h3>
                                        <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.2rem 0 0 0' }}>📍 {evt.location}</p>
                                    </div>
                                    <Link to="/events" style={{ marginLeft: 'auto', padding: '0.5rem 1rem', background: '#fff', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem', color: '#333' }}>Info</Link>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>

                <aside>
                    {/* Reutilización del componente WeatherAside */}
                    <WeatherAside />
                    
                    <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#ffedd5', borderRadius: '8px', border: '1px solid #fed7aa' }}>
                        <h3 style={{ fontWeight: 'bold', color: '#9a3412', marginBottom: '0.5rem' }}>¿Planeando tu viaje?</h3>
                        <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#7c2d12' }}>
                            Contrata nuestros guías oficiales o consulta dudas puntuales.
                        </p>
                        <Link to="/contact" style={{ display: 'block', textAlign: 'center', background: '#fff', padding: '0.5rem', borderRadius: '4px', color: '#9a3412', fontWeight: 'bold', border: '1px solid #fed7aa' }}>
                            Contactar
                        </Link>
                    </div>

                    <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                        <h3 style={{ fontWeight: 'bold', color: '#166534', marginBottom: '0.5rem' }}>Barcelona Card</h3>
                        <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#14532d' }}>
                            Transporte público gratuito y descuentos en museos.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Home;
