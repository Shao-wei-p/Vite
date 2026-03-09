import React from 'react';
import { useQuery } from '@tanstack/react-query';
import WeatherAside from '../components/WeatherAside';
import { MockDB } from '../services/mockDatabase';
import { Event } from '../types';

const fetchEvents = async (): Promise<Event[]> => {
    await new Promise(r => setTimeout(r, 600));
    return MockDB.getEvents();
};

const Events: React.FC = () => {
    const { data: events, isLoading } = useQuery({
        queryKey: ['events'],
        queryFn: fetchEvents,
    });

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', padding: '2rem' }}>
            <main>
                <h1 className="text-2xl font-bold mb-6">Próximos Eventos</h1>
                {isLoading && <p>Cargando agenda cultural...</p>}
                
                {events?.length === 0 && <p>No hay eventos programados.</p>}

                <div style={{ display: 'grid', gap: '1rem' }}>
                    {events?.map(evt => (
                        <div key={evt.id} style={{ border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px', background: '#fff' }}>
                            <div style={{ color: '#666', fontSize: '0.9rem' }}>{evt.date}</div>
                            <h3 style={{ margin: '0.5rem 0', fontSize: '1.25rem' }}>{evt.title}</h3>
                            <p>📍 {evt.location}</p>
                            {evt.description && <p style={{marginTop: '0.5rem', color: '#555'}}>{evt.description}</p>}
                        </div>
                    ))}
                </div>
            </main>
            <aside>
                <WeatherAside />
            </aside>
        </div>
    );
};

export default Events;
