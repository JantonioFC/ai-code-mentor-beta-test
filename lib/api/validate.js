/**
 * Validation Middleware
 * Usa Zod para validar el body o query de la request antes de llegar al handler.
 */
import { ZodError } from 'zod';

export function validate(schema) {
    return (req, res, next) => {
        try {
            if (req.method === 'GET') {
                req.query = schema.parse(req.query);
            } else {
                req.body = schema.parse(req.body);
            }
            // En Next.js API Routes no hay "next()" tradicional como Express
            // Este helper se usa dentro del handler o wrapper.
            // Retornamos true para indicar éxito si se usa imperativamente.
            return true;
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    success: false,
                    error: 'Validation Error',
                    details: error.errors
                });
                return false;
            }
            throw error;
        }
    };
}

/**
 * Higher-order function para validar y ejecutar
 */
export function withValidation(schema, handler) {
    return async (req, res) => {
        try {
            const data = req.method === 'GET' ? req.query : req.body;
            const parsed = schema.parse(data);

            // Reemplazar body/query con datos validados/limpios
            if (req.method === 'GET') req.query = parsed;
            else req.body = parsed;

            return handler(req, res);
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    error: 'Validation Error',
                    details: error.errors
                });
            }
            throw error; // Deja que APIWrapper maneje otros errores
        }
    };
}
