/**
 * Error Operacional Estandarizado.
 * Distingue entre errores esperados (operacionales) y bugs (programación).
 */
export class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational; // true = error confiable/esperado, false = crash/bug
        this.status = statusCode.toString().startsWith('4') ? 'fail' : 'error';

        Error.captureStackTrace(this, this.constructor);
    }
}
