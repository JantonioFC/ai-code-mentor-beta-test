/**
 * API Wrapper - Response Standardization
 * Asegura que todas las respuestas API tengan un formato consistente.
 * { success: boolean, data: any, error: string | null, meta: object }
 */

import { ZodError } from 'zod';
import { logger } from '../utils/logger';

export function createApiHandler(handler) {
    return async (req, res) => {
        try {
            // Ejecutar el handler original
            await handler(req, res);
        } catch (error) {
            handleApiError(error, res);
        }
    };
}

export function sendSuccess(res, data, meta = {}) {
    return res.status(200).json({
        success: true,
        data,
        error: null,
        meta: {
            timestamp: new Date().toISOString(),
            ...meta
        }
    });
}

export function sendError(res, error, status = 500) {
    // Si viene un objeto error, intentamos extraer mensaje
    const message = error instanceof Error ? error.message : error;

    // Log interno
    console.error('[API Error]', error);

    return res.status(status).json({
        success: false,
        data: null,
        error: message,
        meta: {
            timestamp: new Date().toISOString()
        }
    });
}

function handleApiError(error, res) {
    // Error de validación Zod
    if (error instanceof ZodError) {
        return res.status(400).json({
            success: false,
            error: 'Validation Error',
            details: error.errors,
            meta: { timestamp: new Date().toISOString() }
        });
    }

    // Errores conocidos (ej. AppError custom si existiera)
    if (error.statusCode) {
        return sendError(res, error.message, error.statusCode);
    }

    // Error genérico
    logger.error('Unhandled API Error', error);
    return sendError(res, 'Internal Server Error', 500);
}
