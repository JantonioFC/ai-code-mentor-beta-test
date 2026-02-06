/**
 * Raw better-sqlite3 instance getter
 * Used by legacy code that needs direct access to db.prepare()
 */
const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'database', 'sqlite', 'curriculum.db');

let dbInstance = null;

function getDb() {
    if (!dbInstance) {
        try {
            dbInstance = new Database(DB_PATH, {
                verbose: process.env.DB_VERBOSE === 'true' ? console.log : null
            });
            // Performance: WAL mode
            dbInstance.pragma('journal_mode = WAL');
            // Data Integrity: Enforce Foreign Keys
            dbInstance.pragma('foreign_keys = ON');
        } catch (err) {
            console.error('[SQLite] Connection failed:', err);
            throw err;
        }
    }
    return dbInstance;
}

module.exports = getDb();
