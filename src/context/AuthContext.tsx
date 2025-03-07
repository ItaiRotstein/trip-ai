'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  logout: () => void;
  userName: string | null;
  setUserName: (name: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token-tripai');
    const storedName = localStorage.getItem('user-name-tripai');
    setIsAuthenticated(!!token);
    setUserName(storedName);
  }, []);

  const logout = () => {
    localStorage.removeItem('token-tripai');
    localStorage.removeItem('user-name-tripai');
    setIsAuthenticated(false);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout, userName, setUserName }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 