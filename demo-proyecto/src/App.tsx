import React, { useState } from 'react';
import './App.css';
import FormularioIniciaSesion from './components/FormularioIniciaSesion';
import Home from './paginas/Home';
import { dbService } from './servicios/dbService'; // Importamos el servicio

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [userRole, setUserRole] = useState('');

  const handleLogin = async (email: string, pass: string) => {
    setLoginError(''); // Limpiar errores previos
    try {
        const user = await dbService.login(email, pass);
        
        if (user) {
            setUserRole(user.role);
            setIsLoggedIn(true);
        } else {
            setLoginError('Credenciales incorrectas. Prueba admin@demo.com / 123');
        }
    } catch (error) {
        console.error(error);
        setLoginError('Error de conexión con la base de datos.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
    setLoginError('');
  };

  return (
    <div>
      {isLoggedIn ? (
        <Home onLogout={handleLogout} userRole={userRole} />
      ) : (
        <FormularioIniciaSesion onSubmit={handleLogin} error={loginError} />
      )}
    </div>
  );
}

export default App;
