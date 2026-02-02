# Guía de Portfolio Interactivo - AI Code Mentor

Convierte visitantes en oportunidades en 30 segundos.

---

## ⏱️ El Test de 30 Segundos

En 30 segundos, el visitante debe saber:
1. **Quién eres**
2. **Qué haces**
3. **Tu mejor trabajo**
4. **Cómo contactarte**

---

## 📐 Arquitectura del Portfolio

### Secciones Esenciales

| Sección | Propósito | Prioridad |
|---------|-----------|-----------|
| Hero | Hook + identidad | Crítica |
| Proyectos | Demostrar skills | Crítica |
| Sobre mí | Personalidad | Importante |
| Contacto | Convertir | Crítica |
| Testimonios | Prueba social | Nice to have |
| Blog | Thought leadership | Opcional |

### Patrones de Navegación

| Patrón | Mejor Para |
|--------|------------|
| Single page scroll | Diseñadores, creativos |
| Multi-página | Muchos proyectos, mejor SEO |
| Híbrido | Lo mejor de ambos |

---

## 🎯 Fórmula del Hero

```
[Tu nombre]
[Qué haces en una línea]
[Una línea que te diferencia]
[CTA: Ver Trabajo / Contactar]
```

**Ejemplo:**
> **María García**  
> Desarrolladora Full-Stack especializada en EdTech  
> "Ayudo a crear plataformas que hacen el aprendizaje divertido"  
> [Ver Proyectos] [Contactar]

---

## 📊 Mostrar Proyectos

### Elementos de Card

| Elemento | Propósito |
|----------|-----------|
| Thumbnail | Hook visual |
| Título | Qué es |
| One-liner | Qué hiciste |
| Tech stack | Escaneo rápido |
| Resultados | Prueba de impacto |

### Estructura de Case Study

```
1. Hero image/video
2. Overview (2-3 oraciones)
3. El desafío
4. Tu rol
5. Proceso
6. Decisiones clave
7. Resultados/impacto
8. Aprendizajes
9. Links (live, GitHub)
```

### Mostrar Impacto

| ❌ En vez de | ✅ Escribe |
|--------------|-----------|
| "Construí un sitio web" | "Aumenté conversiones 40%" |
| "Diseñé UI" | "Reduje abandono 25%" |
| "Desarrollé features" | "Deployed a 50K usuarios" |

---

## 👨‍💻 Portfolio de Desarrollador

### Lo que Buscan los Recruiters

1. Calidad de código (link a GitHub)
2. Proyectos reales (no solo tutoriales)
3. Problem-solving
4. Comunicación
5. Profundidad técnica

### Must-Haves

- [ ] Link a GitHub (limpio)
- [ ] Links a proyectos live
- [ ] Tech stack por proyecto
- [ ] Tu contribución específica

### Qué Incluir vs Evitar

| ✅ Incluir | ❌ Evitar |
|-----------|----------|
| Problemas reales resueltos | Clones de tutoriales |
| Side projects con usuarios | Proyectos incompletos |
| Contribuciones open source | "Coming soon" |
| Desafíos técnicos | CRUD apps básicas |

---

## ❌ Anti-Patrones

### Template Genérico
**Problema:** Igual que todos, no memorable.  
**Solución:** Toques personales, elementos custom.

### Estilo Sin Sustancia
**Problema:** Animaciones fancy, proyectos débiles.  
**Solución:** Proyectos primero, estilo después.

### Resume Website
**Problema:** Aburrido, no usa el medio.  
**Solución:** Show, don't tell. Case studies visuales.

---

## 🚨 Errores Comunes

| Problema | Solución |
|----------|----------|
| Portfolio más complejo que tu trabajo | Right-size |
| Roto en mobile | Mobile-first |
| No hay CTA claro | Agregar botones de acción |
| Trabajo viejo/irrelevante | Actualizar regularmente |

---

## 💡 Para AI Code Mentor

### Página de Portfolio del Estudiante

```jsx
function StudentPortfolio({ student }) {
  return (
    <div>
      <HeroSection 
        name={student.name}
        title="Aprendiendo a programar con AI Code Mentor"
        lessonsCompleted={student.progress.total}
      />
      
      <ProjectsSection 
        projects={student.projects}
        showTechStack
        showProgress
      />
      
      <BadgesSection badges={student.badges} />
      
      <ContactSection 
        github={student.github}
        linkedin={student.linkedin}
      />
    </div>
  );
}
```
