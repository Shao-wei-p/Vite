import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { USERS } from '../data/mockData';

// Definimos la "forma" que tendrá nuestro contexto (estado + funciones)
interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  hasPermission: (requiredRole: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};

// React.FC<Props> es un tipo genérico para Functional Components
interface AuthProviderProps {
  children: ReactNode; // ReactNode representa cualquier cosa renderizable por React
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole) => {
    // Simulamos un visitante anónimo
    if (role === 'visitor') {
      setUser({ id: 0, username: 'Visitante', role: 'visitor' });
      return;
    }
    // Buscamos usuario simulado
    const found = USERS.find(u => u.role === role);
    if (found) setUser(found);
  };

  const logout = () => setUser(null);

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    const levels: Record<UserRole, number> = { visitor: 0, registered: 1, worker: 2, admin: 3 };
    return levels[user.role] >= levels[requiredRole];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};
