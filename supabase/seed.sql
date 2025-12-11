-- =============================================================================
-- SEED: USUARIO DEMO PARA TESTS E2E
-- =============================================================================
-- Ejecutar este SQL en: Supabase Dashboard > SQL Editor > New Query
-- Credenciales: demo@aicodementor.com / demo123
-- =============================================================================

-- Crear el usuario demo en auth.users
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    raw_app_meta_data,
    aud,
    role,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'demo@aicodementor.com',
    crypt('demo123', gen_salt('bf')),
    NOW(),
    '{"display_name": "Usuario Demo", "provider": "email"}'::jsonb,
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    'authenticated',
    'authenticated',
    NOW(),
    NOW(),
    '',
    ''
) ON CONFLICT (id) DO NOTHING;

-- Crear entrada en auth.identities (requerido para login)
INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '{"sub": "00000000-0000-0000-0000-000000000001", "email": "demo@aicodementor.com", "email_verified": true}'::jsonb,
    'email',
    '00000000-0000-0000-0000-000000000001',
    NOW(),
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Verificar creación
SELECT id, email, created_at FROM auth.users WHERE email = 'demo@aicodementor.com';
