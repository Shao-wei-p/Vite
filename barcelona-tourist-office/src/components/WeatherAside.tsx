import React from 'react';
// Importamos nuestro Custom Hook. Esto abstrae toda la complejidad de la API y React Query.
import { useRealTimeWeather } from '../hooks/useRealTimeWeather';
import './WeatherAside.css';

const WeatherAside: React.FC = () => {
    // Destructuring del resultado del hook de React Query.
    // data: Los datos finales (WeatherData) si la petición fue exitosa.
    // isLoading: true mientras se hace la primera petición.
    // isError: true si falló la red o hubo excepción.
    const { data, isLoading, isError } = useRealTimeWeather();

    // Renderizado condicional (Early Returns):
    // Manejamos los estados tristes antes de intentar renderizar datos que podrían no existir.
    if (isLoading) return <div className="weather-aside">Cargando clima...</div>;
    if (isError) return <div className="weather-aside">Error clima</div>;

    // Optional Chaining (?): "data?.city".
    // Aunque isLoading sea false, TypeScript nos obliga a ser precavidos.
    // Si data fuera null por alguna razón extraña, esto devuelve undefined en lugar de romper la app.
    return (
        <aside className="weather-aside">
            <div className="weather-header">El tiempo en {data?.city}</div>
            <div className="weather-temp">{data?.temp}°C</div>
            <div className="weather-condition">{data?.condition}</div>
            <div className="weather-condition">{data?.date}</div>
        </aside>
    );
};

export default WeatherAside;
