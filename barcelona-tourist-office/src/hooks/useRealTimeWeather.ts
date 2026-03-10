import { useQuery } from '@tanstack/react-query'; // Importamos el hook base de la librería.
import { WeatherData } from '../types'; // Importamos la interfaz del clima.

// Definimos la URL de la API real. 
// Usar constantes evita typos y facilita cambios futuros (ej: cambiar de ciudad).
const API_URL = 'https://api.el-tiempo.net/json/v3/provincias/08/municipios/08019';

// Función asíncrona que hace el trabajo sucio de red.
// Devuelve una Promesa que resolverá un objeto WeatherData.
const fetchWeather = async (): Promise<WeatherData> => {
    try {
        // window.fetch es la API nativa del navegador para peticiones HTTP.
        const response = await fetch(API_URL);
        
        // fetch no lanza error en 404 o 500, hay que verificar .ok manualmente.
        if (!response.ok) {
            throw new Error('Error de red al obtener clima');
        }
        
        // Parseamos el cuerpo de la respuesta como JSON.
        const data = await response.json();

        // Mapeo (Mapping): Adaptamos el JSON de la API externa a nuestra interfaz interna.
        // Esto crea una capa anticorrupción: si la API cambia sus nombres de campo,
        // solo arreglamos este archivo, no toda la UI.
        return {
            city: data.municipio.NOMBRE,
            // parseInt convierte el string "14" a numero 14. Base 10.
            temp: parseInt(data.temperatura_actual, 10),
            condition: data.stateSky.description,
            date: data.fecha
        };
    } catch (error) {
        // Logueamos el error para debugging pero lo relanzamos para que React Query lo detecte como isError.
        console.error("Fallo al cargar clima:", error);
        throw error;
    }
};

// Exportamos el custom hook.
export const useRealTimeWeather = () => {
    // Envolvemos useQuery con configuración específica para clima.
    return useQuery({
        queryKey: ['weather', 'bcn'], // Key única. Todos los componentes que usen este hook compartirán estos datos cacheados.
        queryFn: fetchWeather,
        
        // --- Configuraciones de Caché e Invalidación ---
        refetchInterval: 600000, // (10 min) Vuelve a pedir datos automáticamente cada 10 minutos.
        staleTime: 300000,       // (5 min) Considera los datos "frescos" por 5 minutos.
                                 // Si otro componente pide el clima dentro de 2 min, NO hará petición de red, usará caché.
        retry: 1                 // Si falla, reintenta solo 1 vez antes de dar error definitivo.
    });
};
