import { RateLimiterMemory } from 'rate-limiter-flexible';

// 1. Perfil Estricto: 5 intentos / 15 min (Para Login/Auth)
const authLimiter = new RateLimiterMemory({
    points: 5,
    duration: 15 * 60,
});

// 2. Perfil Estándar: 60 peticiones / 1 min (Para API Usage/Telemetría)
const apiLimiter = new RateLimiterMemory({
    points: 60,
    duration: 60,
});

/**
 * Middleware de Rate Limiting para Next.js API Routes
 * @param {string} profile - 'auth' o 'api'
 */
export default async function rateLimit(req, res, profile = 'auth') {
    const limiter = profile === 'api' ? apiLimiter : authLimiter;
    const errorMessage = profile === 'api'
        ? 'Límite de peticiones de telemetría excedido.'
        : 'Demasiados intentos de inicio de sesión. Por favor intente más tarde.';

    try {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
        await limiter.consume(ip);
    } catch (rejRes) {
        res.status(429).json({ error: errorMessage });
        throw new Error('Rate limit exceeded');
    }
}
