/**
 * SCRIPT: DEBUG AUTHENTICATION SYSTEM
 * Purpose: Deep diagnostic of authentication issues
 */

const db = require('../lib/db');
const bcrypt = require('bcryptjs');

console.log('🔍 DEBUG: Iniciando diagnóstico profundo de autenticación...\n');

// === 1. CHECK DATABASE TABLES ===
console.log('📊 PASO 1: Verificando tablas en la base de datos...');
try {
    const tables = db.query("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
    console.log('✅ Tablas encontradas:', tables.map(t => t.name).join(', '));
} catch (err) {
    console.error('❌ Error listando tablas:', err.message);
}

console.log('\n' + '='.repeat(60) + '\n');

// === 2. CHECK USERS TABLE ===
console.log('👥 PASO 2: Verificando usuarios en la base de datos...');
try {
    const users = db.query('SELECT id, email, full_name, created_at FROM users');
    console.log(`✅ Total de usuarios: ${users.length}`);

    if (users.length > 0) {
        console.log('\n📋 Lista de usuarios:');
        users.forEach((user, index) => {
            console.log(`\n${index + 1}. Usuario:`);
            console.log(`   - ID: ${user.id}`);
            console.log(`   - Email: ${user.email}`);
            console.log(`   - Nombre: ${user.full_name || '(sin nombre)'}`);
            console.log(`   - Creado: ${user.created_at}`);
        });
    } else {
        console.log('⚠️ No hay usuarios registrados en la base de datos.');
    }
} catch (err) {
    console.error('❌ Error consultando usuarios:', err.message);
}

console.log('\n' + '='.repeat(60) + '\n');

// === 3. CHECK USER PROFILES ===
console.log('📋 PASO 3: Verificando perfiles de usuario...');
try {
    const profiles = db.query('SELECT id, email, display_name FROM user_profiles');
    console.log(`✅ Total de perfiles: ${profiles.length}`);

    if (profiles.length > 0) {
        console.log('\n📋 Lista de perfiles:');
        profiles.forEach((profile, index) => {
            console.log(`${index + 1}. ${profile.email} (${profile.display_name})`);
        });
    } else {
        console.log('⚠️ No hay perfiles de usuario.');
    }
} catch (err) {
    console.error('❌ Error consultando perfiles:', err.message);
}

console.log('\n' + '='.repeat(60) + '\n');

// === 4. TEST PASSWORD VERIFICATION ===
console.log('🔑 PASO 4: Probando verificación de contraseñas...');
const DEMO_EMAIL = 'demo@aicodementor.com';
const DEMO_PASSWORD = 'demo123';

try {
    const user = db.findOne('users', { email: DEMO_EMAIL });

    if (user) {
        console.log(`✅ Usuario encontrado: ${user.email}`);
        console.log(`   - ID: ${user.id}`);
        console.log(`   - Password hash presente: ${user.password_hash ? 'SÍ' : 'NO'}`);
        console.log(`   - Versión token: ${user.token_version || 'NO DEFINIDA'}`);

        if (user.password_hash) {
            console.log(`\n🔐 Probando contraseña "${DEMO_PASSWORD}"...`);
            bcrypt.compare(DEMO_PASSWORD, user.password_hash).then(isValid => {
                if (isValid) {
                    console.log('✅ ¡Contraseña CORRECTA!');
                } else {
                    console.log('❌ Contraseña INCORRECTA');
                    console.log('   DIAGNÓSTICO: El hash en la DB no coincide con la contraseña.');
                }
            });
        } else {
            console.log('❌ PROBLEMA: Usuario sin hash de contraseña.');
        }
    } else {
        console.log(`❌ Usuario NO encontrado: ${DEMO_EMAIL}`);
        console.log('   DIAGNÓSTICO: El usuario demo no existe en la base de datos.');
        console.log('   SOLUCIÓN: Ejecutar el script create-demo-user.js');
    }
} catch (err) {
    console.error('❌ Error en verificación de contraseña:', err.message);
}

console.log('\n' + '='.repeat(60) + '\n');

// === 5. CHECK SCHEMA ===
console.log('🏗️ PASO 5: Verificando esquema de tabla users...');
try {
    const schema = db.query("PRAGMA table_info(users)");
    console.log('✅ Columnas de la tabla users:');
    schema.forEach(col => {
        console.log(`   - ${col.name} (${col.type})${col.notnull ? ' NOT NULL' : ''}${col.pk ? ' PRIMARY KEY' : ''}`);
    });
} catch (err) {
    console.error('❌ Error consultando esquema:', err.message);
}

console.log('\n' + '='.repeat(60) + '\n');

// === 6. VERIFY JWT SECRET ===
console.log('🔐 PASO 6: Verificando configuración de JWT...');
const JWT_SECRET = process.env.JWT_SECRET;
if (JWT_SECRET) {
    console.log(`✅ JWT_SECRET configurado (longitud: ${JWT_SECRET.length} caracteres)`);
} else {
    console.log('❌ JWT_SECRET NO configurado');
    console.log('   DIAGNÓSTICO: Falta la variable de entorno JWT_SECRET');
    console.log('   SOLUCIÓN: Verificar archivo .env.local');
}

console.log('\n' + '='.repeat(60));
console.log('\n✅ Diagnóstico completado.\n');
