# Checklist de Verificación Pre-Completación

**REGLA DE HIERRO:** Sin evidencia de verificación, no hay claims de completación.

---

## 🔴 Antes de Hacer Commit

```bash
# 1. Tests pasan
npm test
# Verificar: "X passed, 0 failed"

# 2. Build exitoso
npm run build
# Verificar: Exit code 0

# 3. No hay errores de consola en dev
npm run dev
# Verificar: Sin errores rojos
```

### Checklist Manual

- [ ] Tests: `npm test` ejecutado, 0 failures
- [ ] Build: `npm run build` completa sin errores
- [ ] Tipos: No hay errores de TypeScript (si aplica)
- [ ] Console.log: Eliminados los de depuración
- [ ] Hardcoded: Sin valores hardcodeados (usar .env)
- [ ] Imports: Sin imports no utilizados

---

## 🟡 Antes de Crear PR

Todo lo anterior, más:

- [ ] Branch actualizado con main
- [ ] Conflictos resueltos
- [ ] Commit messages siguen convención
- [ ] README actualizado (si hay cambios de API)
- [ ] CHANGELOG actualizado (si aplica)

### Comando de Verificación Completa

```bash
# Script de verificación pre-PR
npm test && npm run build && echo "✅ Listo para PR"
```

---

## 🟢 Antes de Deploy

Todo lo anterior, más:

- [ ] Tests E2E: `npm run test:e2e`
- [ ] Variables de entorno de producción configuradas
- [ ] Migraciones de BD revisadas
- [ ] Verificación manual en staging (si existe)
- [ ] Rollback plan documentado

---

## ⚠️ Banderas Rojas - DETENTE

Si estás a punto de decir:

| Frase | Acción Correcta |
|-------|-----------------|
| "Debería funcionar" | Ejecuta el comando |
| "Estoy seguro" | Seguridad ≠ evidencia |
| "Solo esta vez" | No hay excepciones |
| "El linter pasó" | Linter ≠ tests |
| "Se ve bien" | Verificación ≠ visual |

---

## 📊 Matriz de Verificación

| Claim | Comando Requerido | No Suficiente |
|-------|-------------------|---------------|
| "Tests pasan" | `npm test` → 0 failures | "Cambié el código" |
| "Build funciona" | `npm run build` → exit 0 | "Linter OK" |
| "Bug arreglado" | Test original pasa | "Modifiqué el fix" |
| "Feature completa" | Checklist de reqs ✓ | "Tests verdes" |

---

## 🛠️ Script de Verificación

```bash
#!/bin/bash
# scripts/verify-before-complete.sh

echo "🔍 Verificando proyecto..."

echo "1/3 Ejecutando tests..."
npm test || exit 1

echo "2/3 Verificando build..."
npm run build || exit 1

echo "3/3 Verificando E2E setup..."
npm run test:e2e:verify || exit 1

echo "✅ VERIFICACIÓN COMPLETA - Listo para completar"
```

---

> **Recuerda**: Ejecutar el comando. Leer el output. ENTONCES hacer el claim.
> 
> Esto no es negociable.
