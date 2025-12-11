/**
 * SCRIPT: AUTO-SETUP COMPLETO
 * 
 * Este script automatiza TODO el setup de la base de datos:
 *   1. Verifica/Crea las tablas necesarias (migraciones)
 *   2. Verifica/Crea el usuario demo para testing
 * 
 * El tester solo necesita configurar sus API keys en .env.local
 * 
 * Uso: Se ejecuta automáticamente con `npm run dev`
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Colores para consola
const c = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    dim: '\x1b[2m'
};

const log = (msg, color = 'reset') => console.log(`${c[color]}${msg}${c.reset}`);

// Configuración
const DEMO_USER = {
    email: 'demo@aicodementor.com',
    password: 'demo123',
    displayName: 'Usuario Demo'
};

async function checkAndRunMigrations(supabaseAdmin) {
    log('📊 [MIGRATIONS] Verificando tablas...', 'dim');

    try {
        // Intentar consultar una tabla que debería existir después de la migración
        const { error } = await supabaseAdmin
            .from('irp_review_requests')
            .select('id')
            .limit(1);

        if (!error) {
            log('✅ [MIGRATIONS] Tablas verificadas.', 'green');
            return true;
        }

        // Si hay error, las tablas no existen
        if (error.message.includes('does not exist') || error.code === '42P01') {
            log('📝 [MIGRATIONS] Tablas no encontradas. Ejecutando migración...', 'cyan');

            // Leer archivo de migración
            const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', 'irp_migration.sql');

            if (!fs.existsSync(migrationPath)) {
                log('⚠️  [MIGRATIONS] Archivo de migración no encontrado.', 'yellow');
                return false;
            }

            const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

            // Ejecutar migración via REST API
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

            const response = await fetch(`${url}/rest/v1/rpc/exec_sql`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': serviceKey,
                    'Authorization': `Bearer ${serviceKey}`
                },
                body: JSON.stringify({ sql: migrationSQL })
            });

            if (response.ok) {
                log('✅ [MIGRATIONS] Tablas creadas exitosamente!', 'green');
                return true;
            } else {
                // Si RPC no existe, indicar que hay que ejecutar manualmente
                log('⚠️  [MIGRATIONS] No se pudo ejecutar automáticamente.', 'yellow');
                log('   Ejecuta manualmente: supabase/migrations/irp_migration.sql', 'dim');
                return false;
            }
        }

        return false;
    } catch (error) {
        log('⚠️  [MIGRATIONS] Error de verificación. Continuando...', 'yellow');
        return false;
    }
}

async function checkAndCreateDemoUser(supabase) {
    log('👤 [DEMO USER] Verificando usuario demo...', 'dim');

    try {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: DEMO_USER.email,
            password: DEMO_USER.password
        });

        if (signInData?.user && !signInError) {
            log('✅ [DEMO USER] Usuario demo verificado.', 'green');
            log(`   📧 ${DEMO_USER.email} | 🔑 ${DEMO_USER.password}`, 'dim');
            await supabase.auth.signOut();
            return true;
        }

        // Intentar crear el usuario
        if (signInError) {
            log('📝 [DEMO USER] Creando usuario demo...', 'cyan');

            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email: DEMO_USER.email,
                password: DEMO_USER.password,
                options: {
                    data: { display_name: DEMO_USER.displayName }
                }
            });

            if (signUpError) {
                if (signUpError.message.includes('already registered')) {
                    log('⚠️  [DEMO USER] Usuario existe con otra contraseña.', 'yellow');
                    log('   Ejecuta: supabase/seed.sql en SQL Editor', 'dim');
                } else {
                    log(`⚠️  [DEMO USER] ${signUpError.message}`, 'yellow');
                }
                return false;
            }

            if (signUpData?.user) {
                log('✅ [DEMO USER] Usuario demo creado!', 'green');
                log(`   📧 ${DEMO_USER.email} | 🔑 ${DEMO_USER.password}`, 'green');
                return true;
            }
        }

        return false;
    } catch (error) {
        log('⚠️  [DEMO USER] Error de verificación.', 'yellow');
        return false;
    }
}

async function autoSetup() {
    console.log('');
    log('╔══════════════════════════════════════════════════════════╗', 'cyan');
    log('║           🔧 AUTO-SETUP - AI CODE MENTOR                 ║', 'cyan');
    log('╚══════════════════════════════════════════════════════════╝', 'cyan');

    // Verificar variables de entorno
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !anonKey) {
        log('\n⚠️  Variables de Supabase no configuradas.', 'yellow');
        log('   Configura .env.local y reinicia el servidor.', 'dim');
        log('   Ver: docs/INSTALLATION_GUIDE.md\n', 'dim');
        return;
    }

    // Crear clientes
    const supabase = createClient(url, anonKey);
    const supabaseAdmin = serviceKey ? createClient(url, serviceKey) : supabase;

    // 1. Verificar/Crear tablas
    await checkAndRunMigrations(supabaseAdmin);

    // 2. Verificar/Crear usuario demo
    await checkAndCreateDemoUser(supabase);

    log('\n╔══════════════════════════════════════════════════════════╗', 'cyan');
    log('║              🚀 SETUP COMPLETADO                         ║', 'cyan');
    log('╚══════════════════════════════════════════════════════════╝\n', 'cyan');
}

// Ejecutar
autoSetup().catch(err => {
    log(`⚠️  Error: ${err.message}`, 'yellow');
});
