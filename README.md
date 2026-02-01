# 🎓 AI Code Mentor - Ecosistema 360 | Plataforma Educativa Completa

## 📋 Descripción

**AI Code Mentor - Ecosistema 360** es una plataforma completa de aprendizaje autogestionado que implementa la metodología educativa **Ecosistema 360** con **Simbiosis Crítica Humano-IA**. 

Combina un currículo estructurado de 24 meses (8 fases: F0-F7) con herramientas profesionales de gestión de portfolio, plantillas educativas y analíticas de progreso avanzadas.

## 🏗️ Arquitectura Actual: v21.0 - Operational Excellence Edition 🚀

**Sistema Operacional:** Plataforma educativa completa basada en **Next.js Modular Monolith** con **SQLite Local**, **Autenticación Nativa**, **Resilient AI Router** y **Standardized API v1**.

### Características Principales:

*   ✅ **Local-First Architecture:** Sin dependencias externas críticas. SQLite (`lib/db.js`).
*   ✅ **Standardized API v1:** Endpoints RESTful versionados (`/api/v1`) con validación centralizada. 🆕
*   ✅ **AI Reliability:** Circuit Breaker pattern para Google Gemini (Fail Fast & Auto-Recovery). 🆕
*   ✅ **Enterprise Security:** Backups con encriptación **AES-GCM**. 🆕
*   ✅ **CI/CD Pipeline:** GitHub Actions para testing automático. 🆕
*   ✅ **Architecture as Code:** Documentación C4 (Mermaid) y OpenAPI Specs. 🆕
*   ✅ **Autenticación Nativa:** JWT seguro.
*   ✅ **Currículo Completo:** 100 semanas, 8 fases.
*   ✅ **Soporte Multi-Dominio:** Programación, Lógica, Bases de Datos.

### Stack Tecnológico (v21.0):

*   **Frontend:** Next.js 15+ + React 18 + TailwindCSS
*   **Backend:** Next.js API Routes (v1 Standardized)
*   **Base de Datos:**
    *   **SQLite (better-sqlite3):** Datos relacionales.
    *   **IndexedDB (Cliente):** Caché y borradores.
*   **Design Pattern:** Controller-Service-Repository. 🆕
*   **Testing:** Jest + Playwright + GitHub Actions CI.
*   **IA Integration:** Gemini 1.5 Pro/Flash (via Resilient Router).

## 🚀 Instalación y Configuración

### Prerrequisitos:

*   Node.js 18+ instalado
*   API key de Gemini (Google AI Studio)

### Pasos de Instalación:

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/ai-code-mentor-v5.git
    cd ai-code-mentor-v5
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno (.env.local):**
    ```bash
    cp .env.example .env.local
    ```

    Configura las variables esenciales:
    ```bash
    # AI Services
    GEMINI_API_KEY=tu-gemini-api-key

    # Auth & Security
    JWT_SECRET=tu-secreto-local-aleatorio
    ```

4.  **Iniciar el ecosistema:**
    ```bash
    npm run dev
    ```
    > **Auto-Setup:** La base de datos `curriculum.db` se inicializa automáticamente.

5.  **Verificar instalación:**
    *   Abre `http://localhost:3000`
    *   Login: `demo@aicodementor.com` / `demo123`

## 🧪 Testing y Calidad

### Unit & Integration (Jest):
Tests de backend, servicios y lógica de negocio.
```bash
npm test
```
*Ahora automatizado via GitHub Actions en cada Push.*

### E2E (Playwright):
Validación visual y de flujos de usuario.
```bash
npx playwright test
```

## 📚 Documentación Técnica (NUEVO)

*   **API Reference:** `docs/openapi.yaml` (Especificación OpenAPI 3.0 para endpoints v1).
*   **Arquitectura:** `docs/architecture/c4-diagrams.md` (Diagramas Mermaid C4).
*   **Guía de Cambios:** ver `walkthrough.md`.

## 📝 Licencia

**Licencia:** MIT

---

**Última actualización:** Febrero 01, 2026
**Versión:** v21.0-stable
**Estado:** ✅ **PRODUCTION READY** - Standardized API & Operational Excellence
