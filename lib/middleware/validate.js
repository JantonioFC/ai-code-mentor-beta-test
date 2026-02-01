import { AppError } from '../utils/AppError.js';

export function validate(schema, handler) {
    return async (req, res) => {
        if (schema.method && req.method !== schema.method) {
            // 405 Method Not Allowed - Operational
            return res.status(405).json({
                error: 'Method Not Allowed',
                message: `Expected ${schema.method}, got ${req.method}`
            });
        }

        const errors = [];
        const source = req.method === 'GET' ? req.query : req.body;

        // Validar campos requeridos
        if (schema.required) {
            for (const field of schema.required) {
                if (source[field] === undefined || source[field] === null || source[field] === '') {
                    errors.push(`Field '${field}' is required`);
                }
            }
        }

        // Validar tipos (básico)
        if (schema.types) {
            for (const [field, type] of Object.entries(schema.types)) {
                if (source[field] !== undefined) {
                    if (type === 'number' && isNaN(Number(source[field]))) {
                        errors.push(`Field '${field}' must be a number`);
                    } else if (type === 'array' && !Array.isArray(source[field])) {
                        errors.push(`Field '${field}' must be an array`);
                    } else if (type === 'boolean' && typeof source[field] !== 'boolean') {
                        if (req.method === 'GET' && source[field] !== 'true' && source[field] !== 'false') {
                            errors.push(`Field '${field}' must be a boolean`);
                        }
                    }
                }
            }
        }

        if (errors.length > 0) {
            // Retornamos directamente response JSON para API routes
            // Podríamos lanzar AppError si tuviéramos un wrapper global de excepciones
            // Pero para middleware de Next.js, retornar JSON limpio es standard.
            // Usaremos AppError internamente si queremos loggear, pero aquí respondemos al cliente.
            return res.status(400).json({
                status: 'fail',
                error: 'Validation Error',
                details: errors
            });
        }

        // Si pasa la validación, ejecutar el handler original
        return handler(req, res);
    };
}
