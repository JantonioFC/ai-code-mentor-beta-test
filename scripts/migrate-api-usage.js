const Database = require('better-sqlite3');
const path = require('path');

// Configuration
const DB_PATH = path.join(__dirname, '..', 'database', 'sqlite', 'curriculum.db');

// Colors
const c = { green: '\x1b[32m', cyan: '\x1b[36m', red: '\x1b[31m', reset: '\x1b[0m', yellow: '\x1b[33m' };
const log = (msg, color = 'reset') => console.log(`${c[color]}${msg}${c.reset}`);

function migrate() {
    log('🚀 Starting API Usage Migration...', 'cyan');

    if (!require('fs').existsSync(DB_PATH)) {
        log(`❌ Database not found at ${DB_PATH}`, 'red');
        process.exit(1);
    }

    const db = new Database(DB_PATH);
    log(`✅ Connected to ${DB_PATH}`, 'green');

    try {
        log('📊 Applying schema changes...', 'cyan');

        db.exec(`
            -- ==========================================
            -- API USAGE TRACKING
            -- ==========================================
            
            -- 1. Detailed Logs Table
            CREATE TABLE IF NOT EXISTS api_usage_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
                endpoint TEXT,          -- e.g., '/api/generate'
                model TEXT NOT NULL,    -- e.g., 'gemini-2.5-flash'
                operation TEXT,         -- e.g., 'generateIRP', 'chat'
                tokens_in INTEGER DEFAULT 0,
                tokens_out INTEGER DEFAULT 0,
                success INTEGER DEFAULT 1, -- Boolean
                response_time_ms INTEGER,
                error_message TEXT,
                ip_address TEXT,
                user_agent TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            -- Index for fast "usage today" lookups
            CREATE INDEX IF NOT EXISTS idx_api_usage_user_date ON api_usage_logs(user_id, created_at);

            -- 2. Daily Aggregates (Optional optimization for high scale, good to have)
            CREATE TABLE IF NOT EXISTS api_usage_daily_stats (
                user_id TEXT NOT NULL,
                date TEXT NOT NULL,     -- YYYY-MM-DD
                model TEXT NOT NULL,
                call_count INTEGER DEFAULT 0,
                token_count_in INTEGER DEFAULT 0,
                token_count_out INTEGER DEFAULT 0,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, date, model)
            );
        `);

        log('✅ Schema migration applied successfully.', 'green');

    } catch (error) {
        log(`❌ Migration Error: ${error.message}`, 'red');
        console.error(error);
        process.exit(1);
    } finally {
        db.close();
        log('🔒 Connection closed.', 'dim');
    }
}

// Run
migrate();
