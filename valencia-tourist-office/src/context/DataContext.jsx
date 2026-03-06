import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_DATA } from '../data';

const DataContext = createContext();
export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);
  const [events, setEvents] = useState([]); // Nuevo estado para eventos
  const [messages, setMessages] = useState([]);
  const [reservations, setReservations] = useState([]); // Nuevo estado para reservas
  const [users, setUsers] = useState([]); // Nuevo estado para gestión de usuarios (Admin)

  useEffect(() => {
    // Simular carga de API
    setActivities(INITIAL_DATA.activities);
    setEvents(INITIAL_DATA.events); // Cargar eventos
    setReservations(INITIAL_DATA.reservations);
    setUsers(INITIAL_DATA.users);
  }, []);

  const addActivity = (act) => setActivities([...activities, { ...act, id: Date.now() }]);
  const deleteActivity = (id) => setActivities(activities.filter(a => a.id !== id));
  // CRUD básico para eventos (simplificado)
  const addEvent = (evt) => setEvents([...events, { ...evt, id: Date.now() }]);
  const deleteEvent = (id) => setEvents(events.filter(e => e.id !== id));

  // LÓGICA DE RESERVAS (Para Usuarios Registrados)
  const makeReservation = (userId, activityId) => {
    const exists = reservations.find(r => r.userId === userId && r.activityId === activityId);
    if (!exists) {
      setReservations([...reservations, { userId, activityId, date: new Date().toISOString().split('T')[0] }]);
      alert("¡Reserva realizada con éxito!");
    } else {
      alert("Ya tienes una reserva para esta actividad.");
    }
  };

  const cancelReservation = (userId, activityId) => {
    setReservations(reservations.filter(r => !(r.userId === userId && r.activityId === activityId)));
    alert("Reserva cancelada.");
  };

  // GESTIÓN DE USUARIOS (Para Admin)
  const deleteUser = (id) => setUsers(users.filter(u => u.id !== id));

  const sendMessage = (msg) => setMessages([...messages, { ...msg, id: Date.now() }]);

  return (
    <DataContext.Provider value={{ 
      activities, 
      events, // Exportar eventos
      messages, 
      reservations, 
      users,
      addActivity, 
      deleteActivity, 
      addEvent,
      deleteEvent,
      makeReservation, 
      cancelReservation,
      deleteUser,
      sendMessage 
    }}>
      {children}
    </DataContext.Provider>
  );
};
