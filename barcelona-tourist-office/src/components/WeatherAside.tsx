import React from 'react';
import { useRealTimeWeather } from '../hooks/useRealTimeWeather';
import './WeatherAside.css';

const WeatherAside: React.FC = () => {
    const { data, isLoading, isError } = useRealTimeWeather();

    if (isLoading) return <div className="weather-aside">Cargando clima...</div>;
    if (isError) return <div className="weather-aside">Error clima</div>;

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
