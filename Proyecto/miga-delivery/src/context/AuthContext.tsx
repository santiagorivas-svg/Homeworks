import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => boolean;
  register: (name: string, email: string, pass: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const ADMIN_USER: User = {
    id: 'admin-1',
    name: 'Administrador Miga',
    email: 'admin@miga.com',
    role: 'admin',
  };

  const [user, setUser] = useState<User | null>(null);
  const [usersDb, setUsersDb] = useState<{ [email: string]: { pass: string; user: User } }>({
    'admin@miga.com': { pass: 'admin123', user: ADMIN_USER },
  });
  const [showAuthModal, setShowAuthModal] = useState(false);

  const login = (email: string, pass: string): boolean => {
    const record = usersDb[email.toLowerCase()];
    if (record && record.pass === pass) {
      setUser(record.user);
      setShowAuthModal(false);
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, pass: string): boolean => {
    const lowerEmail = email.toLowerCase();
    if (usersDb[lowerEmail]) return false;

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email: lowerEmail,
      role: 'user',
    };

    setUsersDb((prev) => ({
      ...prev,
      [lowerEmail]: { pass, user: newUser },
    }));
    setUser(newUser);
    setShowAuthModal(false);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        showAuthModal,
        setShowAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext debe usarse dentro de AuthProvider');
  return context;
};