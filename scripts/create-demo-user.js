/**
 * SCRIPT: CREATE DEMO USER FOR E2E TESTS (LOCAL SQLITE)
 * 
 * Purpose: Register demo@aicodementor.com
 * STRATEGY: DESTROY AND RECREATE (Clean Slate).
 */

const db = require('../lib/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const DEMO_EMAIL = 'demo@aicodementor.com';
const DEMO_PASSWORD = 'demo123';
const DEMO_NAME = 'Usuario Demo';

async function createDemoUser() {
  console.log('🚀 Creating Demo User (Clean Slate)...');

  try {
    // 1. DELETE EXISTING (Cleanup Mismatches) uses raw SQL via db.run
    console.log('🧹 Cleaning up old data...');

    // SQLite doesn't support cascading deletes by default unless enabled, so we delete from both.
    // Order matters if foreign keys are enforced, but we'll try profile first.
    try {
      db.run('DELETE FROM user_profiles WHERE email = ?', [DEMO_EMAIL]);
      db.run('DELETE FROM users WHERE email = ?', [DEMO_EMAIL]);
      console.log('✅ Old data removed.');
    } catch (e) {
      console.warn('⚠️ Warning during cleanup:', e.message);
    }

    // 2. Create user (Fresh)
    const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);
    //  Use consistent UUID for E2E testing
    const userId = '00000000-0000-0000-0000-000000000001';

    console.log('🆕 Creating new user...');
    db.transaction(() => {
      // User Auth
      db.insert('users', {
        id: userId,
        email: DEMO_EMAIL,
        password_hash: hashedPassword,
        full_name: DEMO_NAME,
        avatar_url: '',
        created_at: new Date().toISOString()
      });

      // User Profile (REQUIRED by /api/auth/user)
      db.insert('user_profiles', {
        id: userId,
        email: DEMO_EMAIL,
        display_name: DEMO_NAME,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    })();

    console.log(`✅ User and Profile created! ID: ${userId}`);

  } catch (err) {
    console.error('❌ Error creating demo user:', err);
    process.exit(1);
  }
}

createDemoUser();
