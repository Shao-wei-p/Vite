// src/hooks/useClock.ts
import { useState, useEffect } from 'react';

export const useClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Creamos el intervalo
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Limpieza para evitar fugas de memoria y errores en Strict Mode
    return () => clearInterval(timer);
  }, []);

  // Formateamos la hora para que siempre tenga dos dígitos (HH:MM:SS)
  const formatTime = () => {
    return time.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return { time, formatTime: formatTime() };
};