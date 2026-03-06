// Definimos un tipo unión para restringir los roles a valores específicos
export type UserRole = 'visitor' | 'registered' | 'worker' | 'admin';

// Interfaz que define la estructura de un Usuario
export interface User {
  id: number;
  username: string;
  role: UserRole;
  avatar?: string; // Propiedad opcional
  bookings?: number[]; // IDs de actividades reservadas
}

// Interfaz para las Actividades Turísticas
export interface Activity {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
}

// Interfaz para Eventos
export interface Event {
  id: number;
  title: string;
  date: string;
  capacity: number;
  registered: number;
}

// Interfaz para Mensajes de Contacto
export interface Message {
  id: number;
  email: string;
  content: string;
  isRead: boolean;
  date: string; // Fecha de envío
}
