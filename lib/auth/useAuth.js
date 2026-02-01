// lib/auth/useAuth.js
// LOCAL-FIRST AUTHENTICATION PROVIDER (Real Implementation)

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { logger } from '../utils/logger';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authState, setAuthState] = useState('loading'); // 'loading' | 'authenticated' | 'unauthenticated'

  // Verificación inicial de sesión
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/user');

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setAuthState('authenticated');
      } else {
        setUser(null);
        setAuthState('unauthenticated');
        setAuthState('unauthenticated');
      }
    } catch (error) {
      logger.error('Session check failed', error);
      setUser(null);
      setAuthState('unauthenticated');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.error || 'Error al iniciar sesión' };
      }

      setUser(data.user);
      setAuthState('authenticated');
      return { data, error: null };

    } catch (error) {
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, metadata = {}) => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          display_name: metadata.display_name
        })
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.error || 'Error al registrarse' };
      }

      setUser(data.user);
      setAuthState('authenticated');
      return { data, error: null };

    } catch (error) {
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      logger.error('Error signing out', error);
    } finally {
      setUser(null);
      setAuthState('unauthenticated');
      router.push('/');
    }
    return { error: null };
  };

  const value = {
    user,
    session: user ? { user } : null, // Compatibilidad
    loading,
    authLoading: loading,
    authState,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    checkSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

export default useAuth;
