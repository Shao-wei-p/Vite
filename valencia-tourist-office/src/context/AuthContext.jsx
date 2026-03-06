import React, { createContext, useContext, useState } from 'react';
import { INITIAL_DATA } from '../data';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (role) => {
    // Si rol es visitor, simulamos un usuario genérico sin permisos especiales
    if(role === 'visitor') {
        setUser({ username: 'Visitante', role: 'visitor' });
        return;
    }
    const foundUser = INITIAL_DATA.users.find(u => u.role === role);
    setUser(foundUser);
  };

  const logout = () => setUser(null);

  const hasPermission = (requiredRole) => {
    if (!user) return false;
    const roles = { 'visitor': 0, 'registered': 1, 'worker': 2, 'admin': 3 };
    return roles[user.role] >= roles[requiredRole];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};
