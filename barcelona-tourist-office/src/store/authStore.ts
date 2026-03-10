// Importamos 'create' para generar el store y 'persist' para guardar datos en localStorage.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// Importamos los tipos que definimos antes para asegurar que el store maneje datos válidos.
import { User, Role } from '../types';

// Definimos la forma (Interface) que tendrá nuestro Estado Global de Autenticación.
interface AuthState {
    user: User | null; // El usuario puede ser un objeto User O null (nadie logueado).
    isAuthenticated: boolean; // Bandera rápida para saber si está logueado (true/false).
    
    // Métodos (Acciones) para modificar el estado:
    login: (user: User) => void; // Función que recibe un User y no devuelve nada (void).
    logout: () => void;          // Función sin argumentos para cerrar sesión.
}

// Creamos el Hook personalizado 'useAuthStore'.
// <AuthState> es un Genérico: le dice a Zustand que el store debe coincidir con la interfaz de arriba.
export const useAuthStore = create<AuthState>()(
    // 'persist' es un middleware: intercepta los cambios de estado y los guarda en localStorage.
    persist(
        (set) => ({
            // Valor inicial del estado:
            user: null, 
            isAuthenticated: false,

            // Acción de Login:
            // 'set' es la función mágica de Zustand que actualiza el estado.
            // Recibimos el usuario y actualizamos las propiedades user e isAuthenticated.
            login: (user) => set({ user, isAuthenticated: true }),

            // Acción de Logout:
            // Reseteamos el usuario a null y la bandera a false.
            logout: () => set({ user: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-storage', // Este es el nombre de la "llave" (key) en el localStorage del navegador.
                                  // Puedes verlo en DevTools -> Application -> Local Storage.
        }
    )
);
