'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

interface User {
  userId: string;
  email: string;
  name: string;
  nativeLanguage: string;
  targetLanguage: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  register: (email: string, name: string, nativeLanguage: string, targetLanguage: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('auth_token');
    if (token) {
      refreshUser();
    } else {
      setLoading(false);
    }
  }, []);

  const refreshUser = async () => {
    try {
      const response = await api.getUser();
      setUser(response.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      // Only clear token if it's an authentication error (401), not network errors
      if (error instanceof Error && (error.message.includes('401') || error.message.includes('Unauthorized'))) {
        api.clearToken();
        setUser(null);
      } else {
        // For network errors, keep the user logged in but don't set user data
        console.warn('Network error - keeping user logged in');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string) => {
    const response = await api.login(email);
    api.setToken(response.token);
    setUser(response.user);
  };

  const register = async (email: string, name: string, nativeLanguage: string, targetLanguage: string) => {
    const response = await api.register(email, name, nativeLanguage, targetLanguage);
    api.setToken(response.token);
    setUser(response.user);
  };

  const logout = () => {
    api.clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
