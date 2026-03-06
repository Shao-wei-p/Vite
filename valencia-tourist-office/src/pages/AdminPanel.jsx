import React from 'react';
import { useData } from '../context/DataContext';

const AdminPanel = () => {
  const { messages } = useData();

  return (
    <div className="p-8 bg-purple-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Panel de Administrador</h2>
      <h3 className="font-bold">Mensajes Recibidos:</h3>
      <ul>{messages.map((m, i) => <li key={i} className="border-b p-2">{m.from}: {m.text}</li>)}</ul>
    </div>
  );
};

export default AdminPanel;
