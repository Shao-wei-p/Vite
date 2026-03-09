import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Activity, Event } from '../../types';
import { MockDB } from '../../services/mockDatabase';

const WorkerDashboard: React.FC = () => {
    const [tab, setTab] = useState<'activities' | 'events' | 'attendees'>('activities');
    const queryClient = useQueryClient();
    
    // States para Formularios
    const [isEditing, setIsEditing] = useState(false);
    const [formAct, setFormAct] = useState<Partial<Activity>>({});
    const [formEvt, setFormEvt] = useState<Partial<Event>>({});

    // States para Filtros
    const [actFilter, setActFilter] = useState('');
    const [evtFilter, setEvtFilter] = useState('');
    const [attFilter, setAttFilter] = useState('');

    // --- QUERIES ---
    const { data: activities } = useQuery({ queryKey: ['activities'], queryFn: MockDB.getActivities });
    const { data: events } = useQuery({ queryKey: ['events'], queryFn: MockDB.getEvents });
    const { data: attendees } = useQuery({ queryKey: ['attendees'], queryFn: MockDB.getAllBookings });

    // Lógica de filtrado
    const filteredActivities = activities?.filter(a => a.title.toLowerCase().includes(actFilter.toLowerCase()));
    
    const filteredEvents = events?.filter(e => e.title.toLowerCase().includes(evtFilter.toLowerCase()));
    
    const filteredAttendees = attendees?.filter(a => 
        a.userId.toLowerCase().includes(attFilter.toLowerCase()) || 
        a.activityTitle.toLowerCase().includes(attFilter.toLowerCase())
    );

    // Separar por estado para visualización
    const confirmedBookings = filteredAttendees?.filter(a => a.status === 'confirmed');
    const cancelledBookings = filteredAttendees?.filter(a => a.status === 'cancelled');

    // --- MUTATIONS ACT ---
    const saveActMutation = useMutation({
        mutationFn: MockDB.saveActivity,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activities'] });
            setIsEditing(false);
            setFormAct({});
        }
    });

    const delActMutation = useMutation({
        mutationFn: MockDB.deleteActivity,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['activities'] })
    });

    // --- MUTATIONS EVT ---
    const saveEvtMutation = useMutation({
        mutationFn: MockDB.saveEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            setIsEditing(false);
            setFormEvt({});
        }
    });

    const delEvtMutation = useMutation({
        mutationFn: MockDB.deleteEvent,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['events'] })
    });

    // --- MUTATION RESERVAS ---
    const cancelBookingMut = useMutation({
        mutationFn: MockDB.cancelBooking,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attendees'] });
            alert("Reserva cancelada desde gestión");
        }
    });

    // Helper Styles
    const btnStyle = { padding: '0.5rem 1rem', cursor: 'pointer', marginRight: '5px' };

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
                <button onClick={() => setTab('activities')} style={{...btnStyle, fontWeight: tab==='activities'?'bold':'normal'}}>Actividades</button>
                <button onClick={() => setTab('events')} style={{...btnStyle, fontWeight: tab==='events'?'bold':'normal'}}>Eventos</button>
                <button onClick={() => setTab('attendees')} style={{...btnStyle, fontWeight: tab==='attendees'?'bold':'normal'}}>Reservas</button>
            </div>

            {/* --- TAB ACTIVIDADES --- */}
            {tab === 'activities' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <button onClick={() => { setIsEditing(true); setFormAct({}); }} style={{...btnStyle, background: 'green', color: 'white'}}>+ Nueva Actividad</button>
                        <input 
                            placeholder="Buscar actividad..." 
                            value={actFilter} 
                            onChange={e => setActFilter(e.target.value)}
                            style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>
                    
                    {isEditing && (
                        <div style={{background: '#f9f9f9', padding: '1rem', marginBottom: '1rem', border: '1px solid #ddd'}}>
                            <h4>{formAct.id ? 'Editar' : 'Nueva'} Actividad</h4>
                            <input placeholder="Título" value={formAct.title || ''} onChange={e=>setFormAct({...formAct, title: e.target.value})} style={{display:'block', width:'100%', marginBottom:'0.5rem', padding:'5px'}} />
                            <input placeholder="Precio" type="number" value={formAct.price || ''} onChange={e=>setFormAct({...formAct, price: Number(e.target.value)})} style={{display:'block', width:'100%', marginBottom:'0.5rem', padding:'5px'}} />
                            <input placeholder="Imagen (Emoji)" value={formAct.image || ''} onChange={e=>setFormAct({...formAct, image: e.target.value})} style={{display:'block', width:'100%', marginBottom:'0.5rem', padding:'5px'}} />
                            <button onClick={() => saveActMutation.mutate(formAct as Activity)} style={{...btnStyle, background: 'blue', color:'white'}}>Guardar</button>
                            <button onClick={() => setIsEditing(false)} style={btnStyle}>Cancelar</button>
                        </div>
                    )}

                    <table style={{width: '100%', borderCollapse: 'collapse'}}>
                        <thead><tr style={{background:'#eee'}}><th style={{textAlign:'left', padding:'8px'}}>Img</th><th style={{textAlign:'left', padding:'8px'}}>Nombre</th><th style={{textAlign:'left'}}>Precio</th><th>Accion</th></tr></thead>
                        <tbody>
                            {filteredActivities?.map(a => (
                                <tr key={a.id} style={{borderBottom:'1px solid #eee'}}>
                                    <td style={{padding:'8px'}}>{a.image}</td>
                                    <td>{a.title}</td>
                                    <td>{a.price}€</td>
                                    <td>
                                        <button onClick={() => {setFormAct(a); setIsEditing(true);}} style={{marginRight: '5px'}}>✏️</button>
                                        <button onClick={() => {if(confirm('Borrar?')) delActMutation.mutate(a.id);}}>🗑️</button>
                                    </td>
                                </tr>
                            ))}
                            {filteredActivities?.length === 0 && <tr><td colSpan={4} style={{padding:'1rem', textAlign:'center'}}>No hay resultados</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- TAB EVENTOS --- */}
             {tab === 'events' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <button onClick={() => { setIsEditing(true); setFormEvt({}); }} style={{...btnStyle, background: 'green', color: 'white'}}>+ Nuevo Evento</button>
                        <input 
                            placeholder="Buscar evento..." 
                            value={evtFilter} 
                            onChange={e => setEvtFilter(e.target.value)}
                            style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>
                    
                    {isEditing && (
                        <div style={{background: '#f9f9f9', padding: '1rem', marginBottom: '1rem', border: '1px solid #ddd'}}>
                            <h4>{formEvt.id ? 'Editar' : 'Nuevo'} Evento</h4>
                            <input placeholder="Título" value={formEvt.title || ''} onChange={e=>setFormEvt({...formEvt, title: e.target.value})} style={{display:'block', width:'100%', marginBottom:'0.5rem', padding:'5px'}} />
                            <input placeholder="Fecha" type="date" value={formEvt.date || ''} onChange={e=>setFormEvt({...formEvt, date: e.target.value})} style={{display:'block', width:'100%', marginBottom:'0.5rem', padding:'5px'}} />
                            <input placeholder="Lugar" value={formEvt.location || ''} onChange={e=>setFormEvt({...formEvt, location: e.target.value})} style={{display:'block', width:'100%', marginBottom:'0.5rem', padding:'5px'}} />
                            <button onClick={() => saveEvtMutation.mutate(formEvt as Event)} style={{...btnStyle, background: 'blue', color:'white'}}>Guardar</button>
                            <button onClick={() => setIsEditing(false)} style={btnStyle}>Cancelar</button>
                        </div>
                    )}

                    <table style={{width: '100%', borderCollapse: 'collapse'}}>
                        <thead><tr style={{background:'#eee'}}><th style={{textAlign:'left', padding:'8px'}}>Fecha</th><th style={{textAlign:'left', padding:'8px'}}>Nombre</th><th style={{textAlign:'left'}}>Lugar</th><th>Accion</th></tr></thead>
                        <tbody>
                            {filteredEvents?.map(e => (
                                <tr key={e.id} style={{borderBottom:'1px solid #eee'}}>
                                    <td style={{padding:'8px'}}>{e.date}</td>
                                    <td>{e.title}</td>
                                    <td>{e.location}</td>
                                    <td>
                                        <button onClick={() => {setFormEvt(e); setIsEditing(true);}} style={{marginRight: '5px'}}>✏️</button>
                                        <button onClick={() => {if(confirm('Borrar?')) delEvtMutation.mutate(e.id);}}>🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- TAB RESERVAS --- */}
            {tab === 'attendees' && (
                <div>
                    <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
                        <input 
                            placeholder="Buscar por Usuario o Actividad..." 
                            value={attFilter} 
                            onChange={e => setAttFilter(e.target.value)}
                            style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', width: '300px' }}
                        />
                    </div>

                    {/* TABLA DE CONFIRMADAS */}
                    <h3 style={{ color: '#15803d', borderBottom: '2px solid #15803d', paddingBottom: '0.5rem', marginTop: '1rem' }}>
                        Confirmadas ({confirmedBookings?.length})
                    </h3>
                    <table style={{width: '100%', borderCollapse: 'collapse', marginBottom: '2rem'}}>
                         <thead>
                            <tr style={{background:'#f0fdf4'}}>
                                <th style={{textAlign:'left', padding:'8px'}}>Actividad</th>
                                <th style={{textAlign:'left'}}>ID Usuario</th>
                                <th>Fecha</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                         <tbody>
                            {confirmedBookings?.map(att => (
                                <tr key={att.id} style={{borderBottom: '1px solid #eee'}}>
                                    <td style={{padding:'8px'}}>{att.activityTitle}</td>
                                    <td>{att.userId}</td>
                                    <td>{att.date}</td>
                                    <td>
                                        <button 
                                            onClick={() => {
                                                if(confirm(`¿Cancelar reserva de usuario ${att.userId}?`)) cancelBookingMut.mutate(att.id);
                                            }}
                                            style={{
                                                fontSize: '0.8rem',
                                                padding: '0.25rem 0.5rem',
                                                border: '1px solid #ef4444',
                                                color: '#ef4444',
                                                background: 'white',
                                                cursor: 'pointer',
                                                borderRadius: '4px'
                                            }}
                                        >
                                            Cancelar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {confirmedBookings?.length === 0 && <tr><td colSpan={4} style={{padding:'1rem', textAlign:'center'}}>No hay reservas confirmadas que coincidan.</td></tr>}
                         </tbody>
                    </table>

                    {/* TABLA DE CANCELADAS */}
                    <h3 style={{ color: '#b91c1c', borderBottom: '2px solid #b91c1c', paddingBottom: '0.5rem' }}>
                        Canceladas ({cancelledBookings?.length})
                    </h3>
                    <table style={{width: '100%', borderCollapse: 'collapse', opacity: 0.6}}>
                         <thead>
                            <tr style={{background:'#fef2f2'}}>
                                <th style={{textAlign:'left', padding:'8px'}}>Actividad</th>
                                <th style={{textAlign:'left'}}>ID Usuario</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                         <tbody>
                            {cancelledBookings?.map(att => (
                                <tr key={att.id} style={{borderBottom: '1px solid #eee'}}>
                                    <td style={{padding:'8px'}}>{att.activityTitle}</td>
                                    <td>{att.userId}</td>
                                    <td>{att.date}</td>
                                    <td style={{fontStyle: 'italic', fontWeight: 'bold', color: '#b91c1c'}}>Cancelada</td>
                                </tr>
                            ))}
                            {cancelledBookings?.length === 0 && <tr><td colSpan={4} style={{padding:'1rem', textAlign:'center'}}>No hay reservas canceladas.</td></tr>}
                         </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default WorkerDashboard;
