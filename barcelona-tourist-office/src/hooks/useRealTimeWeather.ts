import { useQuery } from '@tanstack/react-query';
import { WeatherData } from '../types';

const fetchWeather = async (): Promise<WeatherData> => {
    // Simulación de llamada a API
    await new Promise(resolve => setTimeout(resolve, 500));
    const conditions = ['Soleado', 'Nublado', 'Lluvioso', 'Ventoso'];
    return {
        city: 'Barcelona',
        temp: Math.floor(Math.random() * (30 - 15) + 15),
        condition: conditions[Math.floor(Math.random() * conditions.length)]
    };
};

export const useRealTimeWeather = () => {
    return useQuery({
        queryKey: ['weather', 'bcn'],
        queryFn: fetchWeather,
        refetchInterval: 30000, // Refresca cada 30 segundos (Real Time)
        staleTime: 10000,
    });
};
