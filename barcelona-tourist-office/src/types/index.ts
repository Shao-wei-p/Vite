// Definimos un 'Type Alias' llamado Role.
// Esto restringe los valores posibles de una variable a solo estas 4 cadenas de texto.
// Si intentas asignar "superuser", TypeScript dará un error antes de compilar.
export type Role = 'public' | 'registered' | 'worker' | 'admin';

// Definimos una 'Interface' para el Usuario.
// Las interfaces son contratos que definen la forma de un objeto.
export interface User {
    id: string;       // Identificador único (usualmente un UUID o string numérico)
    username: string; // Nombre visible del usuario
    email: string;    // Correo electrónico para login y contacto
    role: Role;       // Aquí usamos el tipo 'Role' definido arriba. Conecta ambas definiciones.
}

// Interface para las Actividades turísticas.
export interface Activity {
    id: string;
    title: string;
    description: string;
    price: number;    // Usamos 'number' tanto para enteros como decimales en JS/TS.
    image: string;    // URL de la imagen o, en este proyecto, un emoji representativo.
}

// Interface para Eventos (agenda cultural).
export interface Event {
    id: string;
    title: string;
    date: string;     // ISO String (ej: "2024-03-20") para facilitar el ordenamiento.
    location: string;
    description?: string; // El signo '?' indica que esta propiedad es OPCIONAL. 
                          // Un evento puede existir sin descripción y no dará error.
}

// Interface para los datos del clima que recibimos de la API externa.
export interface WeatherData {
    temp: number;      // Temperatura numérica
    condition: string; // Descripción texto (ej: "Soleado")
    city: string;      // Nombre de la ciudad
    date: string;      // Fecha de la medición
}
