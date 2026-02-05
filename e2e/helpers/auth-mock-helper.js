/**
 * Auth Mock Helper - Playwright E2E Tests
 * Simula autenticación de Supabase para tests
 * Misión 219.0 - Mock de Autenticación
 */

const jwt = require('jsonwebtoken');

// Use same secret as backend for token validation
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-safe-for-local-only';

/**
 * Mock de sesión autenticada de Supabase
 * Simula una sesión válida en localStorage para que useAuth detecte usuario autenticado
 * 
 * @param {Page} page - Instancia de página de Playwright
 * @param {Object} options - Opciones de configuración
 * @param {string} options.email - Email del usuario mockeado (default: test@example.com)
 * @param {string} options.userId - ID del usuario (default: test-user-123)
 * @param {string} options.accessToken - Token de acceso (default: mock-access-token)
 */
async function mockAuthenticatedSession(page, options = {}) {
  const {
    email = 'demo@aicodementor.com',
    // Use consistent UUID for demo user (matches create-demo-user.js)
    userId = '00000000-0000-0000-0000-000000000001'
  } = options;

  // Generate VALID JWT token using same format as lib/auth-local.js:generateToken()
  const accessToken = jwt.sign(
    {
      sub: userId,        // Use 'sub' claim (standard JWT, used by backend)
      email,
      aud: 'authenticated',
      role: 'authenticated',
      v: 1                // Token version (for revocation system)
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  const refreshToken = 'mock-refresh-token-' + Date.now();

  // Mock de sesión de Supabase que se guarda en localStorage
  const mockSession = {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: 'bearer',
    user: {
      id: userId,
      email: email,
      email_confirmed_at: new Date().toISOString(),
      phone: '',
      confirmed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      app_metadata: {
        provider: 'email',
        providers: ['email']
      },
      user_metadata: {
        email: email
      },
      aud: 'authenticated',
      role: 'authenticated'
    }
  };

  // Usar addInitScript para inyectar el mock ANTES de que cargue la página
  await page.addInitScript((sessionData) => {
    // MISIÓN 219.0 - Activar flag de test para bypass de ProtectedRoute
    window.PLAYWRIGHT_TEST = true;

    // Supabase guarda la sesión en localStorage con una key específica
    // El formato es: sb-{project-ref}-auth-token
    // Como no conocemos el project-ref exacto, usamos un patrón genérico

    const storageKey = 'sb-mock-project-auth-token';

    // Guardar en localStorage
    localStorage.setItem(storageKey, JSON.stringify(sessionData));

    // También guardar en el formato que Supabase client espera
    localStorage.setItem('supabase.auth.token', JSON.stringify(sessionData));

    console.log('🔓 [TEST] Mock de autenticación inyectado:', sessionData.user.email);
    console.log('🧪 [TEST] Flag PLAYWRIGHT_TEST activada para bypass de ProtectedRoute');
  }, mockSession);

  // Interceptar llamadas a la API de Supabase para que retornen la sesión mockeada
  await page.route('**/auth/v1/token**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        access_token: mockSession.access_token,
        token_type: mockSession.token_type,
        expires_in: mockSession.expires_in,
        refresh_token: mockSession.refresh_token,
        user: mockSession.user
      })
    });
  });

  // Interceptar getSession para retornar sesión mockeada
  await page.route('**/auth/v1/user**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockSession.user)
    });
  });

  // Interceptar el endpoint de traducción de token interno (MISIÓN 197)
  await page.route('**/api/v1/auth/translate-token**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          access_token: 'mock-internal-token-' + Date.now()
        }
      })
    });
  });

  // Inject cookie for middleware/SSR
  console.log(`🍪 [TEST] Injecting cookie: ai-code-mentor-auth`);
  await page.context().addCookies([{
    name: 'ai-code-mentor-auth',
    value: accessToken, // Can use same token as localStorage for mock
    domain: 'localhost',
    path: '/',
    expires: Date.now() / 1000 + 3600
  }]);

  console.log('✅ [TEST] Mock de autenticación configurado para:', email);
}

/**
 * Mock de sesión NO autenticada
 * Limpia cualquier sesión existente y fuerza estado no autenticado
 * 
 * @param {Page} page - Instancia de página de Playwright
 */
async function mockUnauthenticatedSession(page) {
  await page.addInitScript(() => {
    // Limpiar cualquier dato de sesión
    localStorage.clear();
    sessionStorage.clear();

    console.log('🔒 [TEST] Mock de NO autenticación inyectado');
  });

  // Interceptar llamadas para retornar "no autenticado"
  await page.route('**/auth/v1/**', async (route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({
        error: 'Not authenticated',
        message: 'User not authenticated'
      })
    });
  });

  console.log('✅ [TEST] Mock de NO autenticación configurado');
}

/**
 * Helper combinado: Setup de página con autenticación
 * Navega a una página con sesión autenticada lista
 * 
 * @param {Page} page - Instancia de página de Playwright
 * @param {string} url - URL a la que navegar
 * @param {Object} authOptions - Opciones de autenticación (opcional)
 */
async function setupAuthenticatedPage(page, url, authOptions = {}) {
  // Configurar mock de autenticación
  await mockAuthenticatedSession(page, authOptions);

  // Navegar a la página
  await page.goto(url);

  // Esperar un poco para que el AuthProvider se inicialice
  await page.waitForTimeout(1000);

  console.log(`✅ [TEST] Página cargada con autenticación: ${url}`);
}

// Exportar funciones
module.exports = {
  mockAuthenticatedSession,
  mockUnauthenticatedSession,
  setupAuthenticatedPage
};
