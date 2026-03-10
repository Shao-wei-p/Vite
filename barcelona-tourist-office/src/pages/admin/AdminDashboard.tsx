import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MockDB } from '../../services/mockDatabase';
// Reutilización de componentes: Importamos el dashboard de worker para no duplicar código
// ya que el Admin puede hacer todo lo que hace un Worker.
import WorkerDashboard from '../worker/WorkerDashboard';

const AdminDashboard: React.FC = () => {
    // State UI: Controla qué pestaña está activa.
    // Union Type Literal: Solo permite estos 3 strings exactos.
    const [activeTab, setActiveTab] = useState<'users' | 'content' | 'inbox'>('users');
    const queryClient = useQueryClient();

    // Estados para filtros de búsqueda locales
    const [userFilter, setUserFilter] = useState('');
    const [msgFilter, setMsgFilter] = useState('');

    // --- QUERIES ---
    // Cargamos usuarios y mensajes al montar el componente.
    // data alias: Renombramos 'data' a 'users' y 'messages' para claridad semántica.
    const { data: users, isLoading: loadingUsers } = useQuery({ queryKey: ['adminUsers'], queryFn: MockDB.getUsers });
    const { data: messages, isLoading: loadingMsgs } = useQuery({ queryKey: ['adminInbox'], queryFn: MockDB.getMessages });

    // --- LÓGICA DE FILTRADO (Client-Side) ---
    // Filtramos la lista de usuarios en memoria basándonos en el input de búsqueda.
    const filteredUsers = users?.filter(u => 
        u.username.toLowerCase().includes(userFilter.toLowerCase()) || 
        u.email.toLowerCase().includes(userFilter.toLowerCase())
    );

    // Derivamos sub-listas para mostrar los usuarios agrupados por rol visualmente.
    const groupAdmins = filteredUsers?.filter(u => u.role === 'admin');
    const groupWorkers = filteredUsers?.filter(u => u.role === 'worker');
    const groupTourists = filteredUsers?.filter(u => u.role === 'registered');

    // Filtramos mensajes de contacto
    const filteredMessages = messages?.filter(m => 
        m.name.toLowerCase().includes(msgFilter.toLowerCase()) || 
        m.email.toLowerCase().includes(msgFilter.toLowerCase()) ||
        m.content.toLowerCase().includes(msgFilter.toLowerCase())
    );

    // --- MUTATIONS (Acciones de escritura) ---
    
    // 1. Eliminar Usuario
    const deleteUserMut = useMutation({
        mutationFn: MockDB.deleteUser,
        onSuccess: () => {
            // Invalidación: Refresca la lista de usuarios automáticamente tras borrar uno.
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
            alert("Usuario eliminado correctamente");
        }
    });

    // 2. Cambiar Rol (Ascender/Degradar)
    // Recibe un objeto con ID y el nuevo Rol.
    const updateRoleMut = useMutation({
        mutationFn: (vars: { id: string, role: string }) => MockDB.updateUserRole(vars.id, vars.role),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminUsers'] })
    });

    // 3. Marcar mensaje como leído
    const markReadMut = useMutation({
        mutationFn: MockDB.markMessageRead,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminInbox'] })
    });

    // --- HELPERS DE UI ---
    // Función que retorna estilos dinámicos para las pestañas (Tabs).
    const getTabStyle = (tabName: string) => ({
        padding: '1rem',
        // Condicional ternario: Si es la tab activa, pon borde rojo y negrita.
        borderBottom: activeTab === tabName ? '3px solid #b91c1c' : '1px solid #ddd',
        fontWeight: activeTab === tabName ? 'bold' : 'normal',
        background: 'none',
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        cursor: 'pointer',
        fontSize: '1rem'
    });

    // Función Render Prop Pattern (simplificado):
    // Encapsula la lógica de renderizado de una tabla para reutilizarla 3 veces (Admins, Workers, Turistas).
    const renderUserTable = (title: string, list: typeof users, color: string) => (
        <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color, borderBottom: `2px solid ${color}`, paddingBottom: '0.5rem' }}>
                {title} ({list?.length || 0})
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #eee' }}>
                 <thead style={{ background: '#f8f8f8' }}>
                     <tr>
                         <th style={{ padding: '1rem', textAlign: 'left' }}>Usuario</th>
                         <th style={{ padding: '1rem', textAlign: 'left' }}>Email</th>
                         <th style={{ padding: '1rem', textAlign: 'left' }}>Rol Actual</th>
                         <th style={{ padding: '1rem', textAlign: 'left' }}>Acciones</th>
                     </tr>
                 </thead>
                 <tbody>
                     {list?.map(u => (
                         <tr key={u.id} style={{ borderTop: '1px solid #eee' }}>
                             <td style={{ padding: '1rem' }}>{u.username}</td>
                             <td style={{ padding: '1rem' }}>{u.email}</td>
                             <td style={{ padding: '1rem' }}>
                                 {/* Select controlado que dispara la mutación al cambiar (onChange) */}
                                 <select 
                                     value={u.role} 
                                     onChange={(e) => updateRoleMut.mutate({ id: u.id, role: e.target.value })}
                                     style={{ padding: '0.25rem' }}
                                 >
                                     <option value="registered">Turista</option>
                                     <option value="worker">Trabajador</option>
                                     <option value="admin">Administrador</option>
                                 </select>
                             </td>
                             <td style={{ padding: '1rem' }}>
                                 <button 
                                     onClick={() => { if(window.confirm('Eliminar usuario '+u.username+'?')) deleteUserMut.mutate(u.id); }}
                                     style={{ color: 'red', border: '1px solid red', padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'white', cursor: 'pointer' }}
                                 >
                                     Eliminar
                                 </button>
                             </td>
                         </tr>
                     ))}
                     {list?.length === 0 && (
                         <tr><td colSpan={4} style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>No se encontraron usuarios en este grupo.</td></tr>
                     )}
                 </tbody>
            </table>
        </div>
    );

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#7f1d1d' }}>Panel de Administración Global</h1>
            
            {/* Navegación Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #eee' }}>
                <button onClick={() => setActiveTab('users')} style={getTabStyle('users')}>Gestión de Usuarios</button>
                <button onClick={() => setActiveTab('content')} style={getTabStyle('content')}>Control de Contenido</button>
                <button onClick={() => setActiveTab('inbox')} style={getTabStyle('inbox')}>Buzón de Entrada</button>
            </div>

            {/* TAB: USUARIOS */}
            {activeTab === 'users' && (
                <div>
                    <h2 style={{ marginBottom: '1rem' }}>Usuarios del Sistema</h2>
                    
                    <div style={{ marginBottom: '1rem' }}>
                        <input 
                            type="text" 
                            placeholder="🔍 Buscar por nombre o email..." 
                            value={userFilter}
                            onChange={(e) => setUserFilter(e.target.value)}
                            style={{ padding: '0.5rem', width: '100%', maxWidth: '400px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>

                    {/* Render Conditional: Loading State */}
                    {loadingUsers ? <p>Cargando...</p> : (
                        <div>
                            {/* Llamamos al helper para renderizar las 3 tablas con colores distintos */}
                            {renderUserTable("Administradores", groupAdmins, "#b91c1c")}
                            {renderUserTable("Trabajadores", groupWorkers, "#d97706")}
                            {renderUserTable("Turistas Registrados", groupTourists, "#166534")}
                        </div>
                    )}
                </div>
            )}

            {/* TAB: CONTENIDO */}
            {activeTab === 'content' && (
                <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', background: '#fff' }}>
                    <p style={{ marginBottom: '1rem', color: '#666', fontStyle: 'italic' }}>* Tienes permisos totales sobre las herramientas de trabajador.</p>
                    {/* Renderizamos el componente WorkerDashboard entero aquí. Composición de componentes. */}
                    <WorkerDashboard />
                </div>
            )}

            {/* TAB: INBOX */}
            {activeTab === 'inbox' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ margin: 0 }}>Mensajes de Contacto</h2>
                        <input 
                            type="text" 
                            placeholder="🔍 Buscar en mensajes..." 
                            value={msgFilter}
                            onChange={(e) => setMsgFilter(e.target.value)}
                            style={{ padding: '0.5rem', width: '300px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {filteredMessages?.length === 0 && <p>No hay mensajes que coincidan con la búsqueda.</p>}
                        
                        {filteredMessages?.map(msg => (
                            <div key={msg.id} style={{ 
                                padding: '1rem', 
                                border: '1px solid #ddd', 
                                borderRadius: '8px', 
                                // Estilos dinámicos: fondo gris si ya se leyó
                                background: msg.read ? '#f3f4f6' : '#fff',
                                // Borde izquierdo azul para resaltar los no leídos
                                borderLeft: msg.read ? '1px solid #ddd' : '4px solid #3b82f6'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    {/* Escapado seguro de HTML por defecto en React */}
                                    <strong>{msg.name} &lt;{msg.email}&gt;</strong>
                                    <span style={{ fontSize: '0.8rem', color: '#666' }}>{new Date(msg.date).toLocaleDateString()}</span>
                                </div>
                                <p style={{ marginBottom: '1rem' }}>{msg.content}</p>
                                
                                {/* Botón condicional: solo aparece si no se ha leído */}
                                {!msg.read ? (
                                    <button 
                                        onClick={() => markReadMut.mutate(msg.id)} // Llama a la mutación
                                        style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Marcar como Leído
                                    </button>
                                ) : (
                                    <span style={{ color: 'green', fontWeight: 'bold' }}>✓ Leído</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
