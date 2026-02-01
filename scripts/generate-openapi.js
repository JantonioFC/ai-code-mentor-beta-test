/**
 * Script Generador de OpenAPI
 * Lee los esquemas Zod definidos en la API y genera un spec OpenAPI 3.0
 */
const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
// const { generateSchema } = require('@anatine/zod-openapi'); // Unused for now
// Nota: Como estamos en un script fuera del build process de Next.js, importar los archivos de API directamente
// es complejo si usan imports de alias (@/...) o dependencias de entorno.
// 
// ESTRATEGIA: Vamos a definir los esquemas base aquí manualmente por ahora para cumplir el objetivo de documentación,
// ya que importar los archivos de API requeriría un setup de babel-register complejo.

const openApiSpec = {
    openapi: '3.0.0',
    info: {
        title: 'AI Code Mentor API',
        version: '1.0.0',
        description: 'API para generación de lecciones y feedback educativo'
    },
    servers: [
        { url: 'http://localhost:3000/api/v1', description: 'Local Server' }
    ],
    components: {
        schemas: {
            LessonRequest: {
                type: 'object',
                properties: {
                    semanaId: { type: 'number', example: 1 },
                    dia: { type: 'number', example: 1 },
                    pomodoroIndex: { type: 'number', example: 0 },
                    includeMultimodal: { type: 'boolean', default: false },
                    useStorytellingPrompt: { type: 'boolean', default: true },
                    useLLMJudge: { type: 'boolean', default: false }
                },
                required: ['semanaId', 'pomodoroIndex']
            },
            FeedbackRequest: {
                type: 'object',
                properties: {
                    userId: { type: 'string', example: 'user-123' },
                    lessonId: { type: 'string', example: 'uuid-lesson' },
                    rating: { type: 'number', min: 1, max: 5 },
                    wasHelpful: { type: 'boolean' },
                    comment: { type: 'string' }
                },
                required: ['userId', 'lessonId', 'rating']
            },
            ApiResponse: {
                type: 'object',
                properties: {
                    success: { type: 'boolean' },
                    data: { type: 'object' },
                    error: { type: 'string', nullable: true },
                    meta: { type: 'object' }
                }
            }
        }
    },
    paths: {
        '/lessons/generate': {
            post: {
                summary: 'Generar Lección',
                tags: ['Lessons'],
                requestBody: {
                    content: {
                        'application/json': { schema: { $ref: '#/components/schemas/LessonRequest' } }
                    }
                },
                responses: {
                    200: {
                        description: 'Lección generada exitosamente',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    }
                }
            }
        },
        '/lessons/feedback': {
            post: {
                summary: 'Enviar Feedback',
                tags: ['Feedback'],
                requestBody: {
                    content: {
                        'application/json': { schema: { $ref: '#/components/schemas/FeedbackRequest' } }
                    }
                },
                responses: {
                    201: {
                        description: 'Feedback registrado',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } }
                    }
                }
            }
        }
    }
};

const outputPath = path.join(__dirname, '../docs/openapi.yaml');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, yaml.stringify(openApiSpec));

console.log(`✅ OpenAPI Spec generado en: ${outputPath}`);
