'use client';

import { useAuth } from '../../lib/auth/useAuth';
import LoadingScreen from './LoadingScreen';
import { useEffect } from 'react';

/**
 * ClientOnlyAuthWrapper
 * 
 * @description Wrapper de autenticación que se renderiza SOLO en cliente
 *              para evitar hydration mismatch. Se importa con dynamic import
 *              y { ssr: false } desde _app.js.
 * 
 * @architecture
 * - NO se renderiza en servidor (ssr: false en dynamic import)
 * - Muestra LoadingScreen mientras authState es 'loading'
 * - Renderiza children cuando autenticación está resuelta
 * 
 * @author AI Code Mentor Team
 * @date 2026-02-06
 */
export default function ClientOnlyAuthWrapper({ children }) {
    const authContext = useAuth();
    const { authState, loading, user } = authContext;

    // DEBUG: Log every render
    console.log('🔄 [WRAPPER] Render - authState:', authState, 'loading:', loading, 'user:', user?.email);

    // DEBUG: Track state changes
    useEffect(() => {
        console.log('⚡ [WRAPPER] State changed - authState:', authState, 'loading:', loading);
    }, [authState, loading]);

    // Mientras auth está cargando, mostrar loading screen
    if (authState === 'loading' || loading) {
        console.log('📺 [WRAPPER] Showing LoadingScreen');
        return <LoadingScreen message="Verificando sesión..." />;
    }

    // Auth resuelto - renderizar app
    console.log('✅ [WRAPPER] Rendering children');
    return <>{children}</>;
}
