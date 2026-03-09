import { Activity, Event, User, Role } from '../types';

// Tipos para la BDD simulada
export interface BookingDB {
    id: string;
    userId: string;
    activityId?: string; // Hacer opcional
    activityTitle: string;
    date: string;
    status: 'confirmed' | 'cancelled';
    price: number;
}

export interface UserDB extends User {
    password?: string; // Solo simulación
}

export interface MessageDB {
    id: string;
    name: string;
    email: string;
    content: string;
    read: boolean;
    date: string;
}

const STORAGE_KEY_BOOKINGS = 'bcn_bookings_db';
const STORAGE_KEY_USERS = 'bcn_users_db';
const STORAGE_KEY_MESSAGES = 'bcn_messages_db';
const STORAGE_KEY_ACTIVITIES = 'bcn_activities_db';
const STORAGE_KEY_EVENTS = 'bcn_events_db';

// Helper generico
const getStorage = <T>(key: string, defaultData: T[] = []): T[] => {
    const data = localStorage.getItem(key);
    if (!data) {
        // Inicializar si está vacío
        if (defaultData.length > 0) localStorage.setItem(key, JSON.stringify(defaultData));
        return defaultData;
    }
    return JSON.parse(data);
};

const setStorage = (key: string, data: any[]) => localStorage.setItem(key, JSON.stringify(data));

// Datos iniciales
const initialUsers: UserDB[] = [
    { id: 'u1', username: 'Turista', email: 'u@test.com', role: 'registered', password: '123' },
    { id: 'w1', username: 'Worker BCN', email: 'worker@bcn.cat', role: 'worker', password: '123' },
    { id: 'a1', username: 'Admin Boss', email: 'admin@bcn.cat', role: 'admin', password: '123' }
];

const initialActivities: Activity[] = [
    { id: '1', title: 'Sagrada Familia Tour', description: 'Visita guiada completa.', price: 35, image: '🏰' },
    { id: '2', title: 'Passeig de Gràcia', description: 'Ruta modernista.', price: 0, image: '🚶' },
    { id: '3', title: 'Park Güell', description: 'Acceso zona monumental.', price: 15, image: '🦎' },
];

const initialEvents: Event[] = [
    { id: '1', title: 'Sonar Festival', date: '2024-06-15', location: 'Fira Gran Via' },
    { id: '2', title: 'Primavera Sound', date: '2024-05-30', location: 'Parc del Fòrum' },
];

export const MockDB = {
    // --- AUTH ---
    registerUser: async (username: string, email: string, password: string): Promise<User> => {
        await new Promise(r => setTimeout(r, 500));
        const users = getStorage<UserDB>(STORAGE_KEY_USERS, initialUsers);
        
        if (users.find(u => u.email === email)) throw new Error("El email ya existe");

        const newUser: UserDB = {
            id: crypto.randomUUID(),
            username,
            email,
            role: 'registered',
            password // Simulado
        };
        users.push(newUser);
        setStorage(STORAGE_KEY_USERS, users);
        return {id: newUser.id, username, email, role: 'registered'};
    },

    loginUser: async (email: string): Promise<User | null> => {
        await new Promise(r => setTimeout(r, 500));
        const users = getStorage<UserDB>(STORAGE_KEY_USERS, initialUsers);
        const user = users.find(u => u.email === email);
        if (!user) return null;
        // En una app real validariamos password aqui
        return { id: user.id, username: user.username, email: user.email, role: user.role };
    },

    // --- ACTIVIDADES ---
    getActivities: async (): Promise<Activity[]> => {
        return getStorage<Activity>(STORAGE_KEY_ACTIVITIES, initialActivities);
    },
    saveActivity: async (act: Activity): Promise<void> => {
        const list = getStorage<Activity>(STORAGE_KEY_ACTIVITIES, initialActivities);
        const index = list.findIndex(a => a.id === act.id);
        if (index >= 0) list[index] = act;
        else list.push({...act, id: act.id || crypto.randomUUID()});
        setStorage(STORAGE_KEY_ACTIVITIES, list);
    },
    deleteActivity: async (id: string): Promise<void> => {
        const list = getStorage<Activity>(STORAGE_KEY_ACTIVITIES, initialActivities);
        setStorage(STORAGE_KEY_ACTIVITIES, list.filter(a => a.id !== id));
    },

    // --- EVENTOS ---
    getEvents: async (): Promise<Event[]> => {
        return getStorage<Event>(STORAGE_KEY_EVENTS, initialEvents);
    },
    saveEvent: async (evt: Event): Promise<void> => {
        const list = getStorage<Event>(STORAGE_KEY_EVENTS, initialEvents);
        const index = list.findIndex(e => e.id === evt.id);
        if (index >= 0) list[index] = evt;
        else list.push({...evt, id: evt.id || crypto.randomUUID()});
        setStorage(STORAGE_KEY_EVENTS, list);
    },
    deleteEvent: async (id: string): Promise<void> => {
        const list = getStorage<Event>(STORAGE_KEY_EVENTS, initialEvents);
        setStorage(STORAGE_KEY_EVENTS, list.filter(e => e.id !== id));
    },

    // Crear una reserva
    createBooking: async (userId: string, activity: Activity): Promise<BookingDB> => {
        await new Promise(r => setTimeout(r, 500)); // Latencia de red
        const bookings = getStorage<BookingDB>(STORAGE_KEY_BOOKINGS);
        
        const newBooking: BookingDB = {
            id: crypto.randomUUID(),
            userId,
            activityId: activity.id,
            activityTitle: activity.title,
            date: new Date().toISOString().split('T')[0], // Fecha de hoy
            status: 'confirmed',
            price: activity.price
        };
        
        bookings.push(newBooking);
        setStorage(STORAGE_KEY_BOOKINGS, bookings);
        console.log("Reserva guardada en DB:", newBooking);
        return newBooking;
    },

    // Obtener reservas de un usuario
    getUserBookings: async (userId: string): Promise<BookingDB[]> => {
        await new Promise(r => setTimeout(r, 500));
        const bookings = getStorage<BookingDB>(STORAGE_KEY_BOOKINGS);
        return bookings.filter(b => b.userId === userId);
    },

    // Cancelar una reserva
    cancelBooking: async (bookingId: string): Promise<void> => {
        await new Promise(r => setTimeout(r, 500));
        const bookings = getStorage<BookingDB>(STORAGE_KEY_BOOKINGS);
        const index = bookings.findIndex(b => b.id === bookingId);
        
        if (index !== -1) {
            bookings[index].status = 'cancelled';
            setStorage(STORAGE_KEY_BOOKINGS, bookings);
            console.log("Reserva cancelada en DB:", bookingId);
        }
    },

    // Obtener todas las reservas (para Worker/Admin)
    getAllBookings: async (): Promise<BookingDB[]> => {
        await new Promise(r => setTimeout(r, 500));
        return getStorage<BookingDB>(STORAGE_KEY_BOOKINGS);
    },

    // --- MÉTODOS DE USUARIOS (ADMIN) ---
    getUsers: async (): Promise<UserDB[]> => {
        await new Promise(r => setTimeout(r, 500));
        return getStorage<UserDB>(STORAGE_KEY_USERS, initialUsers);
    },

    deleteUser: async (id: string): Promise<void> => {
        await new Promise(r => setTimeout(r, 300));
        const users = getStorage<UserDB>(STORAGE_KEY_USERS, initialUsers);
        const filtered = users.filter(u => u.id !== id);
        setStorage(STORAGE_KEY_USERS, filtered);
    },

    updateUserRole: async (id: string, newRole: string): Promise<void> => {
        await new Promise(r => setTimeout(r, 300));
        const users = getStorage<UserDB>(STORAGE_KEY_USERS, initialUsers);
        const user = users.find(u => u.id === id);
        if (user) {
            user.role = newRole as Role;
            setStorage(STORAGE_KEY_USERS, users);
        }
    },

    // --- MÉTODOS DE MENSAJES (CONTACTO) ---
    saveMessage: async (name: string, email: string, content: string): Promise<void> => {
        await new Promise(r => setTimeout(r, 300));
        const msgs = getStorage<MessageDB>(STORAGE_KEY_MESSAGES);
        msgs.push({
            id: crypto.randomUUID(),
            name,
            email,
            content,
            read: false,
            date: new Date().toISOString()
        });
        setStorage(STORAGE_KEY_MESSAGES, msgs);
    },

    getMessages: async (): Promise<MessageDB[]> => {
        await new Promise(r => setTimeout(r, 500));
        return getStorage<MessageDB>(STORAGE_KEY_MESSAGES);
    },

    markMessageRead: async (id: string): Promise<void> => {
        await new Promise(r => setTimeout(r, 300));
        const msgs = getStorage<MessageDB>(STORAGE_KEY_MESSAGES);
        const msg = msgs.find(m => m.id === id);
        if (msg) {
            msg.read = true;
            setStorage(STORAGE_KEY_MESSAGES, msgs);
        }
    }
};
