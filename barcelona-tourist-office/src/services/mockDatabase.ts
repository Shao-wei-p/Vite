import { Activity } from '../types';

// Tipos para la BDD simulada
export interface BookingDB {
    id: string;
    userId: string;
    activityId: string;
    activityTitle: string;
    date: string;
    status: 'confirmed' | 'cancelled';
    price: number;
}

const STORAGE_KEY_BOOKINGS = 'bcn_bookings_db';

// Helper para leer/escribir
const getBookings = (): BookingDB[] => {
    const data = localStorage.getItem(STORAGE_KEY_BOOKINGS);
    return data ? JSON.parse(data) : [];
};

const saveBookings = (bookings: BookingDB[]) => {
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
};

export const MockDB = {
    // Crear una reserva
    createBooking: async (userId: string, activity: Activity): Promise<BookingDB> => {
        await new Promise(r => setTimeout(r, 500)); // Latencia de red
        const bookings = getBookings();
        
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
        saveBookings(bookings);
        console.log("Reserva guardada en DB:", newBooking);
        return newBooking;
    },

    // Obtener reservas de un usuario
    getUserBookings: async (userId: string): Promise<BookingDB[]> => {
        await new Promise(r => setTimeout(r, 500));
        const bookings = getBookings();
        return bookings.filter(b => b.userId === userId);
    },

    // Cancelar una reserva
    cancelBooking: async (bookingId: string): Promise<void> => {
        await new Promise(r => setTimeout(r, 500));
        const bookings = getBookings();
        const index = bookings.findIndex(b => b.id === bookingId);
        
        if (index !== -1) {
            bookings[index].status = 'cancelled';
            saveBookings(bookings);
            console.log("Reserva cancelada en DB:", bookingId);
        }
    },

    // Obtener todas las reservas (para Worker/Admin)
    getAllBookings: async (): Promise<BookingDB[]> => {
        await new Promise(r => setTimeout(r, 500));
        return getBookings();
    }
};
