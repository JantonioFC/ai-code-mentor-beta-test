import { withOptionalAuth, createAdaptiveResponse } from '../../../../utils/authMiddleware';
import { logger } from '../../../../lib/utils/logger';
import { profileService } from '../../../../lib/services/ProfileService';
import { validate } from '../../../../lib/middleware/validate';

// Esquema de validación para POST
const postSchema = {
    method: 'POST',
    // Example: required fields validation if needed, currently req.body is spread
    // We can add strict validation later
};

async function handler(req, res) {
    if (req.method !== 'GET' && req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Validación POST manual invocando middleware si es POST
    // (Nuestra valida funcion wrap todo, pero aquí queremos logica condicional)
    // Para simplificar, usaremos la lógica nativa del middleware solo en POST si se separara,
    // pero dado que es un handler mixto, lo validamos dentro o usamos "validate" wrap genérico sin "required" method strict

    try {
        const { isAuthenticated, user, userId } = req.authContext;

        if (req.method === 'POST') {
            if (!isAuthenticated) {
                return res.status(401).json({
                    success: false,
                    error: 'Autenticación requerida para actualizar perfil',
                    requireAuth: true
                });
            }

            logger.info(`[API v1/PROFILE] Actualizando perfil para: ${user.email} (${userId})`, { userId });

            const updatedProfile = await profileService.updateProfile(userId, req.body);

            return res.status(200).json({
                success: true,
                authenticated: true,
                message: 'Perfil actualizado exitosamente',
                profile: updatedProfile
            });
        }

        if (req.method === 'GET') {
            if (isAuthenticated) {
                logger.info(`[API v1/PROFILE] Obteniendo perfil personal para: ${user.email} (${userId})`, { userId });
                const profile = await profileService.getProfile(userId, user.email);

                const authenticatedResponse = {
                    profile,
                    capabilities: [
                        'Ver progreso personal',
                        'Actualizar información',
                        'Gestionar preferencias',
                        'Ver estadísticas detalladas'
                    ]
                };
                return res.status(200).json(createAdaptiveResponse(req, authenticatedResponse, null));
            } else {
                logger.info('[API v1/PROFILE] Obteniendo perfil público para usuario anónimo');
                const anonymousResponse = {
                    profile: { display_name: 'Guest User' },
                    type: 'public',
                    limitations: ['Solo información básica disponible', 'Sin progreso personal']
                };
                return res.status(200).json(createAdaptiveResponse(req, null, anonymousResponse));
            }
        }

    } catch (error) {
        logger.error('[API v1/PROFILE] Error', error);
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            message: error.message
        });
    }
}

export default withOptionalAuth(handler);
