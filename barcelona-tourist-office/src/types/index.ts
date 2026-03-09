export type Role = 'public' | 'registered' | 'worker' | 'admin';

export interface User {
    id: string;
    username: string;
    email: string;
    role: Role;
}

export interface Activity {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
}

export interface Event {
    id: string;
    title: string; // Cambiado de name a title para consistencia
    date: string;
    location: string;
    description?: string;
}

export interface WeatherData {
    temp: number;
    condition: string;
    city: string;
    date: string;
}
