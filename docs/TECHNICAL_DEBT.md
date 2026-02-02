# Deuda Técnica - AI Code Mentor

Inventario de deuda técnica y plan de modernización.

---

## 🔴 Crítico (Resolver Esta Semana)

### 1. ESLint Deshabilitado
**Ubicación:** `package.json` línea 9
**Problema:** Linting deshabilitado temporalmente por migración a ESLint 9
**Impacto:** Posibles bugs de estilo, imports no usados, problemas de calidad
**Solución:**
1. Crear `eslint.config.js` (flat config)
2. Migrar reglas de `.eslintrc.json`
3. Ejecutar fix: `npx eslint . --fix`
4. Restaurar script: `"lint": "eslint ."`

### 2. Console.logs de Depuración
**Ubicación:** `pages/login.js`, `lib/auth/useAuth.js`
**Problema:** Logs extensos de debugging en producción
**Impacto:** Exposición de datos, performance, ruido en consola
**Solución:** 
- Envolver en `if (process.env.NODE_ENV === 'development')`
- O usar `lib/utils/logger.js` con niveles

---

## 🟡 Alto (Resolver Este Mes)

### 3. Archivos .backup
**Ubicación:** `pages/panel-de-control.backup`
**Problema:** Archivos de respaldo versionados
**Acción:** Eliminar, usar Git para historial

### 4. Inconsistencia de Imports
**Problema:** Mezcla de CommonJS (`require`) y ESM (`import`)
**Ubicación:** `lib/db.js`, algunos scripts
**Solución:** Estandarizar a ESM donde sea posible

### 5. Dependencias Peer Obsoletas
**Problema:** `npm ci --legacy-peer-deps` requerido
**Causa:** `zod-to-openapi@0.2.1` requiere `zod@~3.5.1`
**Solución:** 
- Actualizar `zod-to-openapi` a versión compatible
- O eliminar si no se usa activamente

---

## 🟢 Medio (Backlog Q1)

### 6. Archivos Grandes
| Archivo | Líneas | Acción |
|---------|--------|--------|
| `lib/templates.js` | 567 | Dividir por categoría |
| `pages/login.js` | 408 | Extraer componentes |
| `lib/devdocs-retriever.js` | ~1000 | Modularizar |

### 7. Tests E2E Incompletos
**Estado:** Playwright configurado, pocos tests escritos
**Acción:** Aumentar cobertura de flujos críticos

### 8. TypeScript Parcial
**Estado:** `tsconfig.json` existe, tipado mínimo
**Acción:** Migrar gradualmente archivos críticos

---

## ⚪ Bajo (Nice to Have)

- Documentar APIs internas con JSDoc
- Añadir Storybook para componentes
- Implementar error boundary global
- Añadir monitoreo de errores (Sentry)

---

## 📊 Métricas de Deuda

| Categoría | Items | Estimación |
|-----------|-------|------------|
| Crítico | 2 | 2-4 horas |
| Alto | 3 | 4-8 horas |
| Medio | 3 | 8-16 horas |
| Bajo | 4 | 16+ horas |

**Total estimado para llegar a "deuda cero":** ~40 horas

---

## 🎯 Plan de Acción

### Sprint Inmediato
1. ✅ Arreglar ESLint (2h)
2. ✅ Limpiar console.logs (1h)
3. ✅ Eliminar archivos .backup (30min)

### Próximo Sprint
4. Resolver peer deps de Zod
5. Estandarizar imports ESM
6. Dividir archivos grandes

---

> **Principio:** Nunca romper funcionalidad existente sin plan de migración.
