import React from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * ACADÉMICO: Paso de funciones por props.
 * `onDelete` y `onReserve` son funciones pasadas desde el padre (Listado) al hijo (Card).
 * El hijo solo invoca la función cuando ocurre el evento onClick, no necesita saber la lógica interna.
 */
const CardComponent = ({ item, onDelete, onReserve }) => {
  const { user, hasPermission } = useAuth();

  return (
    <div className="bg-white border rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-orange-600">{item.title}</h3>
        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
          {item.price}€
        </span>
      </div>
      <p className="text-gray-600 mb-4">{item.desc}</p>
      
      <div className="flex gap-2 mt-auto">
        {/* Lógica de botones por Rol */}
        
        {/* Solo usuarios registrados pueden reservar */}
        {user?.role === 'registered' && (
          <button 
            onClick={() => onReserve(item)}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Reservar Plaza
          </button>
        )}

        {/* Workers y Admin pueden ver opciones de gestión */}
        {hasPermission('worker') && (
          <>
            <button className="flex-1 bg-yellow-400 text-yellow-900 py-2 rounded">Editar</button>
            <button 
              onClick={() => onDelete(item.id)}
              className="flex-1 bg-red-100 text-red-600 py-2 rounded hover:bg-red-200"
            >
              Eliminar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CardComponent;
