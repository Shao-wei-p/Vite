import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Activity, Event, Message } from '../types';
import { USERS, ACTIVITIES } from '../data/mockData';

interface DataContextType {
  // Estados
  users: User[];
  activities: Activity[];
  events: Event[];
  messages: Message[];
  
  // Acciones Usuarios
  addUser: (user: User) => void;
  deleteUser: (id: number) => void;
  toggleBooking: (userId: number, activityId: number) => void;

  // Acciones Actividades/Eventos (Worker/Admin)
  addActivity: (act: Activity) => void;
  deleteActivity: (id: number) => void;
  addEvent: (evt: Event) => void;
  deleteEvent: (id: number) => void;

  // Acciones Mensajes
  addMessage: (msg: Message) => void;
  markMessageRead: (id: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData debe usarse dentro de un DataProvider");
  return context;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(USERS);
  const [activities, setActivities] = useState<Activity[]>(ACTIVITIES);
  const [events, setEvents] = useState<Event[]>([
    { id: 1, title: 'La Crida', date: '2024-02-25', capacity: 5000, registered: 1200 },
    { id: 2, title: 'Mascletà Dia 1', date: '2024-03-01', capacity: 200, registered: 50 }
  ]);
  const [messages, setMessages] = useState<Message[]>([]);

  // --- Lógica Usuarios ---
  const addUser = (user: User) => setUsers([...users, user]);
  const deleteUser = (id: number) => setUsers(users.filter(u => u.id !== id));
  
  const toggleBooking = (userId: number, activityId: number) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== userId) return u;
      const bookings = u.bookings || [];
      if (bookings.includes(activityId)) {
        return { ...u, bookings: bookings.filter(b => b !== activityId) }; // Cancelar
      }
      return { ...u, bookings: [...bookings, activityId] }; // Reservar
    }));
  };

  // --- Lógica Actividades/Eventos ---
  const addActivity = (act: Activity) => setActivities([...activities, act]);
  const deleteActivity = (id: number) => setActivities(activities.filter(a => a.id !== id));
  
  const addEvent = (evt: Event) => setEvents([...events, evt]);
  const deleteEvent = (id: number) => setEvents(events.filter(e => e.id !== id));

  // --- Lógica Mensajes ---
  const addMessage = (msg: Message) => setMessages([...messages, msg]);
  const markMessageRead = (id: number) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
  };

  return (
    <DataContext.Provider value={{
      users, activities, events, messages,
      addUser, deleteUser, toggleBooking,
      addActivity, deleteActivity, addEvent, deleteEvent,
      addMessage, markMessageRead
    }}>
      {children}
    </DataContext.Provider>
  );
};
