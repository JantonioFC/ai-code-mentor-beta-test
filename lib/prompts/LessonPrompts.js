/**
 * TEMPLATES DE PROMPTS PARA GENERACIÓN DE LECCIONES
 * Extraídos de pages/api/generate-lesson.js
 */

export const TEMPLATE_PROMPT_UNIVERSAL = \`
🚨 **ALERTA CRITICÁ: PROHIBIDO USAR CONOCIMIENTO PREVIO DE CS50**
🛑 **DIRECTIVA DE FIDELIDAD CONTEXTUAL ABSOLUTA**

IMPORTANTE: Olvídate COMPLETAMENTE de todo lo que sabes sobre CS50, Harvard, o cualquier curso de programación. 
Tu Única fuente de verdad es el siguiente bloque de texto delimitado por [CONTEXTO]. 
NO uses información externa. NO menciones C, Python, JavaScript, línea de comandos, o printf().
Si el contexto dice "Scratch", habla SOLO de Scratch. Si dice "pensamiento computacional", habla SOLO de eso.

[CONTEXTO]
Temática Semanal: {tematica_semanal}
Concepto del Día: {concepto_del_dia}  
Tarea Específica del Pomodoro: {texto_del_pomodoro}
[/CONTEXTO]

🛑 **REPETICIÓN DE DIRECTIVA:** Tu tema central es: "{texto_del_pomodoro}"
NO te desvíes. NO uses conocimiento externo. SOLO el contexto delimitado arriba.

Eres un tutor de programación experto especializado EXCLUSIVAMENTE en el tema contextual proporcionado.

Tu misión es crear una micro-lección educativa COMPLETA y un quiz basado SOLO en el [CONTEXTO].

**ESPECIFICACIONES OBLIGATORIAS DEL CONTENIDO:**
1. **Extensión:** Mínimo 800 palabras de contenido educativo sustancial
2. **Estructura:** Subtítulos claros con explicaciones conceptuales detalladas 
3. **Ejemplos:** Mínimo 3 ejemplos prácticos diferentes y progresivos
4. **Pedagogía:** 1 analogía obligatoria para facilitar comprensión
5. **Enfoque:** Explicar tanto el QUÉ como el CÓMO y el POR QUÉ de la tarea
6. **FIDELIDAD:** Basándote EXCLUSIVAMENTE en la tarea específica del contexto delimitado
7. **PROHIBICIÓN:** NO menciones lenguajes de programación textual si el contexto habla de programación visual

🚨 **ADVERTENCIA FINAL:** Si generas contenido sobre C, Python, línea de comandos, o printf() cuando el contexto habla de Scratch, has fallado completamente.

Basado ESTRICTA y EXCLUSIVAMENTE en el [CONTEXTO] delimitado arriba, genera lo siguiente en formato JSON:
{
  "contenido": "Un texto de lección educativo ROBUSTO de mínimo 800 palabras que explique COMPREHENSIVAMENTE SOLO la tarea mencionada en el CONTEXTO. NO uses información externa. DEBE incluir: (1) Subtítulos claros organizando el contenido, (2) Explicaciones conceptuales detalladas del QUÉ, CÓMO y POR QUÉ, (3) Exactamente 3 ejemplos prácticos progresivos basados en el CONTEXTO, (4) Una analogía clara para facilitar comprensión, (5) Conexiones con conceptos relacionados DENTRO del CONTEXTO. NO te desvíes del CONTEXTO proporcionado, desarrolla profundamente SOLO la tarea específica delimitada.",
  "quiz": [
    {
      "pregunta": "Una pregunta que evalúe la comprensión conceptual profunda de la tarea del CONTEXTO (NO uses conocimiento externo).",
      "opciones": ["Opción A basada en CONTEXTO", "Opción B basada en CONTEXTO", "Opción C basada en CONTEXTO", "Opción D basada en CONTEXTO"],
      "respuesta_correcta": "La opción correcta basada en el CONTEXTO"
    },
    {
      "pregunta": "Una segunda pregunta que evalúe la aplicación práctica de la tarea del CONTEXTO (NO uses conocimiento externo).",
      "opciones": ["Opción A basada en CONTEXTO", "Opción B basada en CONTEXTO", "Opción C basada en CONTEXTO", "Opción D basada en CONTEXTO"],
      "respuesta_correcta": "La opción correcta basada en el CONTEXTO"
    },
    {
      "pregunta": "Una tercera pregunta que evalúe la conexión con conceptos relacionados DENTRO del CONTEXTO (NO uses conocimiento externo).",
      "opciones": ["Opción A basada en CONTEXTO", "Opción B basada en CONTEXTO", "Opción C basada en CONTEXTO", "Opción D basada en CONTEXTO"],
      "respuesta_correcta": "La opción correcta basada en el CONTEXTO"
    }
  ]
}

🚨 **RECORDATORIO FINAL:** Solo habla de lo que está en el [CONTEXTO]. Si dice Scratch, habla de Scratch. Si dice sprites, habla de sprites. NO menciones otros lenguajes.
\`;
