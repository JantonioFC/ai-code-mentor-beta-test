import db from '../../../lib/db';
import AuthLocal from '../../../lib/auth-local';
import { parse } from 'cookie';

/**
 * GET /api/usage/stats
 * Retrieves usage statistics for the current user.
 */
export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const user = await getUserFromRequest(req);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Get aggregated stats for today (Local time approximation or UTC)
        // SQLite doesn't have great timezone support, using UTC for consistency
        // querying logs created >= today's start

        // Usage count for today
        const stats = db.get(`
      SELECT 
        COUNT(*) as calls_today,
        SUM(case when success = 0 then 1 else 0 end) as failed_calls
      FROM api_usage_logs 
      WHERE user_id = ? 
      AND date(created_at) = date('now')
    `, [user.id]);

        // Get recent history (limit 20)
        const history = db.query(`
      SELECT 
        operation, 
        model, 
        success, 
        response_time_ms as responseTime, 
        created_at as timestamp 
      FROM api_usage_logs 
      WHERE user_id = ? 
      ORDER BY created_at DESC 
      LIMIT 50
    `, [user.id]);

        return res.status(200).json({
            callsToday: stats.calls_today || 0,
            failedCalls: stats.failed_calls || 0,
            history: history.map(h => ({
                ...h,
                success: Boolean(h.success)
            }))
        });

    } catch (error) {
        console.error('Error fetching API stats:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getUserFromRequest(req) {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const payload = AuthLocal.verifyToken(token);
            if (payload) return payload;
        }
        if (req.headers.cookie) {
            const cookies = parse(req.headers.cookie);
            if (cookies.token) {
                const payload = AuthLocal.verifyToken(cookies.token);
                if (payload) return payload;
            }
        }
    } catch (e) { return null; }
    return null;
}
