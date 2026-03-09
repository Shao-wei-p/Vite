import { useQuery } from '@tanstack/react-query';
import { WeatherData } from '../types';

// URL actualizada para el-tiempo.net (Barcelona)
const API_URL = 'https://api.el-tiempo.net/json/v3/provincias/08/municipios/08019';

const fetchWeather = async (): Promise<WeatherData> => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Error de red al obtener clima');
        }
        const data = await response.json();

        // Mapeo según el formato JSON proporcionado:
        // - Temperatura actual: data.temperatura_actual (string)
        // - Condición: data.stateSky.description (string)
        // - Ciudad: data.municipio.NOMBRE (string)
        return {
            city: data.municipio.NOMBRE,
            temp: parseInt(data.temperatura_actual, 10),
            condition: data.stateSky.description,
            date: data.fecha
        };
    } catch (error) {
        console.error("Fallo al cargar clima:", error);
        throw error;
    }
};

export const useRealTimeWeather = () => {
    return useQuery({
        queryKey: ['weather', 'bcn'],
        queryFn: fetchWeather,
        refetchInterval: 600000, // Refrescar cada 10 minutos
        staleTime: 300000, 
        retry: 1
    });
};
