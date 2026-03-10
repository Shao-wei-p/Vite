// Importamos los tipos necesarios.
import { Activity, Event, User, Role } from '../types';

// Interfaces internas solo para la Base de Datos (DB)
export interface BookingDB {
    id: string;
    userId: string;
    activityId: string;
    activityTitle: string; // Guardamos el título aquí por si la actividad se borra en el futuro (snapshot).
    date: string;
    status: 'confirmed' | 'cancelled';
    price: number;
}

export interface MessageDB {
    id: string;
    name: string;
    email: string;
    content: string;
    read: boolean;
    date: string;
}

// Constantes para las llaves del LocalStorage. Evita escribir strings mágicos repetidos y cometer errores.
const K_BOOKINGS = 'bcn_bookings_db';
const K_ACTIVITIES = 'bcn_activities_db';
const K_EVENTS = 'bcn_events_db';
const K_USERS = 'bcn_users_db';
const K_MESSAGES = 'bcn_messages_db';

// --- DATA INICIAL (SEED) ---
// Estos arrays sirven para poblar la app la primera vez que se abre.
const INITIAL_ACTIVITIES: Activity[] = [
    { id: '1', title: 'Sagrada Familia Tour', description: 'Visita guiada con acceso rápido.', price: 35, image: '🏰' },
    { id: '2', title: 'Park Güell', description: 'Paseo por el parque modernista.', price: 15, image: '🦎' },
    { id: '3', title: 'Ruta de Tapas', description: 'Degustación por el barrio gótico.', price: 45, image: '🍷' },
    { id: '4', title: 'Paseo en Barco', description: 'Vistas del skyline desde el mar.', price: 20, image: '⛵' },
    { id: '5', title: 'Museo Picasso', description: 'Colección permanente del artista.', price: 12, image: '🎨' },
    { id: '6', title: 'Camp Nou Experience', description: 'Tour por el estadio del Barça.', price: 30, image: '⚽' },
];

const INITIAL_EVENTS: Event[] = [
    { id: '1', title: 'Fiesta de la Mercè', date: '2024-09-24', location: 'Toda la ciudad', description: 'La fiesta mayor de Barcelona.' },
    { id: '2', title: 'Primavera Sound', date: '2024-06-01', location: 'Parc del Fòrum', description: 'Festival internacional de música.' },
    { id: '3', title: 'Sant Jordi', date: '2024-04-23', location: 'Las Ramblas', description: 'Día del libro y la rosa.' },
];

const INITIAL_USERS: User[] = [
    { id: 'u1', username: 'Admin', email: 'admin@bcn.cat', role: 'admin' },
    { id: 'u2', username: 'Worker', email: 'worker@bcn.cat', role: 'worker' },
    { id: 'u3', username: 'Turista', email: 'u@test.com', role: 'registered' },
];

// --- HELPERS (Funciones auxiliares) ---
// Función Genérica <T>: Funciona con cualquier tipo de dato (Activities, Users, etc.).
// Lee del localStorage y si no existe, guarda y devuelve el valor inicial.
const get = <T>(key: string, initial: T): T => {
    const data = localStorage.getItem(key);
    if (!data) {
        localStorage.setItem(key, JSON.stringify(initial));
        return initial;
    }
    return JSON.parse(data); // Convierte el string JSON de vuelta a objeto JS.
};

// Guarda cualquier dato <T> en localStorage convirtiéndolo a string.
const save = <T>(key: string, data: T) => localStorage.setItem(key, JSON.stringify(data));

// Simula la lentitud de internet. Devuelve una promesa que se resuelve después de 'ms' milisegundos.
const delay = (ms = 500) => new Promise(r => setTimeout(r, ms));

export const MockDB = {
    // --- ACTIVIDADES ---
    // Simula un GET /api/activities
    getActivities: async (): Promise<Activity[]> => {
        await delay(); // Espera artificial (loading spinner se mostrará en la UI gracias a esto)
        return get(K_ACTIVITIES, INITIAL_ACTIVITIES);
    },
    
    // Simula un POST /api/activities (Crear) o PUT (Actualizar)
    saveActivity: async (act: Activity): Promise<void> => {
        await delay();
        // Obtenemos la lista actual
        const list = get<Activity[]>(K_ACTIVITIES, INITIAL_ACTIVITIES);
        
        if(act.id) {
            // Si tiene ID, es EDICIÓN:
            const idx = list.findIndex(a => a.id === act.id);
            if(idx !== -1) list[idx] = act; // Reemplazamos el objeto existente
        } else {
            // Si no tiene ID, es CREACIÓN:
            act.id = crypto.randomUUID(); // Generamos ID único nativo del navegador
            list.push(act);
        }
        save(K_ACTIVITIES, list); // Guardamos la lista actualizada
    },
    
    // Simula DELETE /api/activities/:id
    deleteActivity: async (id: string): Promise<void> => {
        await delay();
        const list = get<Activity[]>(K_ACTIVITIES, INITIAL_ACTIVITIES);
        // Filtramos para crear una nueva lista SIN el elemento borrado
        save(K_ACTIVITIES, list.filter(a => a.id !== id));
    },

    // --- EVENTOS ---
    getEvents: async (): Promise<Event[]> => {
        await delay();
        return get(K_EVENTS, INITIAL_EVENTS);
    },
    saveEvent: async (evt: Event): Promise<void> => {
        await delay();
        const list = get<Event[]>(K_EVENTS, INITIAL_EVENTS);
        if(evt.id) {
            const idx = list.findIndex(e => e.id === evt.id);
            if(idx !== -1) list[idx] = evt;
        } else {
            evt.id = crypto.randomUUID();
            list.push(evt);
        }
        save(K_EVENTS, list);
    },
    deleteEvent: async (id: string): Promise<void> => {
        await delay();
        const list = get<Event[]>(K_EVENTS, INITIAL_EVENTS);
        save(K_EVENTS, list.filter(e => e.id !== id));
    },

    // --- USUARIOS (AUTH) ---
    loginUser: async (email: string): Promise<User | undefined> => {
        await delay(800); // Un poco más de delay para dar sensación de seguridad/procesamiento
        const users = get<User[]>(K_USERS, INITIAL_USERS);
        // Busca el usuario ignorando mayúsculas/minúsculas
        return users.find(u => u.email.toLowerCase() === email.toLowerCase());
    },
    
    registerUser: async (username: string, email: string, _password: string): Promise<User> => {
        await delay(800);
        const users = get<User[]>(K_USERS, INITIAL_USERS);
        
        // Validación básica de negocio: no duplicar emails
        if (users.find(u => u.email === email)) throw new Error("El email ya existe");
        
        // Creamos el nuevo usuario. Por defecto el rol es 'registered' (Turista).
        const newUser: User = { id: crypto.randomUUID(), username, email, role: 'registered' };
        users.push(newUser);
        save(K_USERS, users);
        return newUser;
    },
    getUsers: async (): Promise<User[]> => {
        await delay();
        return get(K_USERS, INITIAL_USERS);
    },
    deleteUser: async (id: string): Promise<void> => {
        await delay();
        const users = get<User[]>(K_USERS, INITIAL_USERS);
        save(K_USERS, users.filter(u => u.id !== id));
    },
    updateUserRole: async (id: string, role: string): Promise<void> => {
        await delay();
        const users = get<User[]>(K_USERS, INITIAL_USERS);
        const user = users.find(u => u.id === id);
        if(user) {
            user.role = role as Role;
            save(K_USERS, users);
        }
    },

    // --- RESERVAS ---
    createBooking: async (userId: string, activity: Activity): Promise<BookingDB> => {
        await delay();
        const bookings = get<BookingDB[]>(K_BOOKINGS, []);
        
        const newBooking: BookingDB = {
            id: crypto.randomUUID(),
            userId,
            activityId: activity.id,
            activityTitle: activity.title, // Snapshot del título
            date: new Date().toISOString().split('T')[0], // Fecha actual YYYY-MM-DD
            status: 'confirmed',
            price: activity.price
        };
        
        bookings.push(newBooking);
        save(K_BOOKINGS, bookings);
        return newBooking;
    },
    
    getUserBookings: async (userId: string): Promise<BookingDB[]> => {
        await delay();
        const bookings = get<BookingDB[]>(K_BOOKINGS, []);
        // Filtramos solo las reservas que pertenecen a ESTE usuario
        return bookings.filter(b => b.userId === userId);
    },
    cancelBooking: async (bookingId: string): Promise<void> => {
        await delay();
        const bookings = get<BookingDB[]>(K_BOOKINGS, []);
        const booking = bookings.find(b => b.id === bookingId);
        if (booking) {
            booking.status = 'cancelled';
            save(K_BOOKINGS, bookings);
        }
    },
    getAllBookings: async (): Promise<BookingDB[]> => {
        await delay();
        return get<BookingDB[]>(K_BOOKINGS, []);
    },

    // --- MENSAJES (CONTACTO) ---
    saveMessage: async (name: string, email: string, content: string): Promise<void> => {
        await delay();
        const msgs = get<MessageDB[]>(K_MESSAGES, []);
        msgs.push({
            id: crypto.randomUUID(),
            name, email, content, 
            read: false,
            date: new Date().toISOString()
        });
        save(K_MESSAGES, msgs);
    },
    getMessages: async (): Promise<MessageDB[]> => {
        await delay();
        return get<MessageDB[]>(K_MESSAGES, []);
    },
    markMessageRead: async (id: string): Promise<void> => {
        await delay();
        const msgs = get<MessageDB[]>(K_MESSAGES, []);
        const msg = msgs.find(m => m.id === id);
        if(msg) {
            msg.read = true;
            save(K_MESSAGES, msgs);
        }
    }
};
