import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, AuthContextType } from '../types';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: true,
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  useEffect(() => {
    const loadUserFromStorage = async () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('authUser');

      if (token && userData) {
        try {
          const user: User = JSON.parse(userData);
          setAuthState({
            isAuthenticated: true,
            user: user,
            token: token,
            isLoading: false,
          });
        } catch (error) {
          console.error('Failed to parse user data or validate token', error);
          logout();
        }
      } else {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    };
    loadUserFromStorage();
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(user));
    setAuthState({
      isAuthenticated: true,
      user,
      token,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};