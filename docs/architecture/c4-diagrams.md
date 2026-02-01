# Diagramas de Arquitectura C4

Documentación visual de la arquitectura de AI Code Mentor usando el modelo C4.

## 1. System Context Context (Nivel 1)
Vista de alto nivel de los usuarios y sistemas externos.

\`\`\`mermaid
C4Context
  title System Context Diagram - AI Code Mentor

  Person(student, "Estudiante", "Estudiante de CS50 aprendiendo programación")
  System(aiCodeMentor, "AI Code Mentor", "Plataforma de tutoría de código inteligente")
  System_Ext(gemini, "Google Gemini API", "LLM para generación de contenido y análisis")

  Rel(student, aiCodeMentor, "Usa para aprender", "HTTPS")
  Rel(aiCodeMentor, gemini, "Genera lecciones y feedback", "HTTPS/JSON")
\`\`\`

## 2. Container Diagram (Nivel 2)
Vista de los contenedores desplegables y tecnologías.

\`\`\`mermaid
C4Container
  title Container Diagram - AI Code Mentor

  Person(student, "Estudiante", "Usuario final")

  System_Boundary(c1, "AI Code Mentor") {
    Container(webApp, "Web Application", "Next.js (React)", "Frontend y API Routes")
    ContainerDb(sqlite, "SQLite DB", "better-sqlite3", "Almacena progreso, semanas y currículo")
  }

  System_Ext(gemini, "Google Gemini API", "Motor de IA")

  Rel(student, webApp, "Visita /api/v1 calls", "HTTPS")
  Rel(webApp, sqlite, "Lee/Escribe", "SQL/Internal")
  Rel(webApp, gemini, "Analiza código", "HTTPS")
\`\`\`

## 3. Component Diagram (Nivel 3)
Detalle interno del Backend (API Routes).

\`\`\`mermaid
C4Component
  title Component Diagram - Backend Logic

  Container_Boundary(api, "API Layer") {
    Component(lessonCtrl, "Lesson Controller", "/api/v1/lessons/generate", "Valida requests y llama servicios")
    Component(profileCtrl, "Profile Controller", "/api/v1/profile", "Gestiona perfiles de usuario")
  }

  Container_Boundary(core, "Core Domain") {
    Component(lessonSvc, "Lesson Service", "Class", "Lógica de generación de lecciones")
    Component(profileSvc, "Profile Service", "Class", "Lógica de usuarios y progreso")
    Component(geminiRouter, "Gemini Router", "Class", "Orquesta llamadas a IA con Circuit Breaker")
  }

  Container_Boundary(data, "Data Layer") {
    Component(weekRepo, "Week Repository", "Class", "Acceso datos semanas")
    Component(currRepo, "Curriculum Repository", "Class", "Acceso datos currículo")
    Component(db, "DB Wrapper", "lib/db.js", "Gestión conexión SQLite")
  }

  Rel(lessonCtrl, lessonSvc, "Usa")
  Rel(profileCtrl, profileSvc, "Usa")
  
  Rel(lessonSvc, geminiRouter, "Genera contenido via")
  Rel(lessonSvc, weekRepo, "Lee contexto")
  
  Rel(weekRepo, db, "Query")
  Rel(currRepo, db, "Query")
\`\`\`
