/**
 * AuthLoadingWrapper - Wrapper de Carga de Autenticación
 * 
 * @description Componente cliente-only que verifica el estado de autenticación
 *              y muestra el LoadingScreen mientras la sesión está siendo validada.
 *              
 * ARQUITECTURA (FIX HYDRATION):
 * - Solo renderiza contenido DESPUÉS de montar en cliente
 * - Evita hydration mismatch al no renderizar nada diferente en servidor
 * - Usa pattern de "suppressHydrationWarning" + client-only rendering
 * 
 * @author Mentor Coder
 * @version 2.1.0 (Hydration Fix)
 * @mission 221 - Eliminación de Race Condition en Autenticación
 */
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth/useAuth';
import LoadingScreen from './LoadingScreen';

export default function AuthLoadingWrapper({ children }) {
  const { authState, loading, user } = useAuth();
  const [hasMounted, setHasMounted] = useState(false);

  // CRITICAL: Solo después de montar en cliente
  useEffect(() => {
    setHasMounted(true);
    console.log('🏗️ [AUTH-WRAPPER] Mounted on client');
  }, []);

  // HYDRATION FIX: Durante SSR y antes de montar, renderizar skeleton consistente
  // Esto evita el mismatch porque servidor y cliente inicial renderizan lo mismo
  if (!hasMounted) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900"
        suppressHydrationWarning
      />
    );
  }

  // CLIENTE: Ahora podemos usar authState de forma segura
  const isActuallyLoading = authState === 'loading' || loading;

  if (isActuallyLoading) {
    console.log('🔄 [AUTH-WRAPPER] [CLIENT] Loading - authState:', authState);
    return <LoadingScreen message="Verificando sesión..." />;
  }

  // Estado resuelto - permitir renderizado de la aplicación
  console.log('✅ [AUTH-WRAPPER] Unlocked - authState:', authState, 'user:', user?.email);
  return <>{children}</>;
}
