import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Profile() {
  const { user } = useAuth();

  // Protección de ruta: Si no hay usuario, mandar a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Componentes internos simples para cada rol
  const AdminPanel = () => (
    <div style={{ background: '#ffebee', padding: '10px' }}>
      <h3>Panel de Administrador 🛠️</h3>
      <button>Gestionar Usuarios</button>
      <button>Editar Web</button>
    </div>
  );

  const WorkerPanel = () => (
    <div style={{ background: '#e3f2fd', padding: '10px' }}>
      <h3>Panel de Trabajador 📋</h3>
      <button>Ver Reservas del Día</button>
      <button>Actualizar Eventos</button>
    </div>
  );

  const UserPanel = () => (
    <div style={{ background: '#e8f5e9', padding: '10px' }}>
      <h3>Mi Espacio de Viajero 🎒</h3>
      <button>Mis Tickets Comprados</button>
      <button>Favoritos</button>
    </div>
  );

  return (
    <div>
      <h1>Perfil de {user.username}</h1>
      <p>Rol: {user.role}</p>
      <hr />
      
      {/* Lógica para mostrar el panel correcto */}
      {user.role === 'admin' && <AdminPanel />}
      {user.role === 'worker' && <WorkerPanel />}
      {user.role === 'registered_user' && <UserPanel />}
    </div>
  );
}
