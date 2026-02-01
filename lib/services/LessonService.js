import { geminiRouter } from '../ai/router/GeminiRouter';
import { logger } from '../utils/logger';
import { TEMPLATE_PROMPT_UNIVERSAL } from '../prompts/LessonPrompts';
import { weekRepository } from '../repositories/WeekRepository';

export class LessonService {

    /**
     * Genera una lección granular basada en el contexto del pomodoro
     */
    async generateLesson({ semanaId, dia, pomodoroIndex }) {
        try {
            // 1. Obtener Contexto (Data Layer Access)
            const contexto = await this._getGranularContext(semanaId, dia, pomodoroIndex);

            // 2. Validar Coherencia Contextual (Business Logic)
            const validation = this._validateContextualCoherence(contexto);
            if (!validation.isValid) {
                logger.warn('[LessonService] Advertencias de coherencia contextual', validation.warnings);
            }

            // 3. Construir Prompt (Business Logic)
            const prompt = this._buildPrompt(contexto);

            // 4. Llamar a IA (AI Layer)
            // Usamos GeminiRouter en lugar del wrapper legacy
            const aiResponse = await geminiRouter.analyze({
                code: prompt, // El router espera 'code' o 'prompt' dependiendo de la implementación. 
                // Revisando GeminiRouter, usa request object. 
                // GeminiProvider usa `request.code` + prompts.
                // Vamos a adaptar el request para que funcione con la estructura actual.
                language: 'markdown',
                phase: 'lesson-generation',
                analysisType: 'lesson', // Custom type
                systemPrompt: "Eres un arquitecto de contenido educativo experto.",
                userPrompt: prompt
            });

            // 5. Validar y Post-procesar Respuesta
            const lessonData = typeof aiResponse.analysis === 'string'
                ? JSON.parse(aiResponse.analysis.replace(/```json/g, '').replace(/```/g, ''))
                : aiResponse.analysis;

            // TODO: Post-processing validation logic

            return {
                success: true,
                data: lessonData,
                metadata: {
                    contexto
                }
            };

        } catch (error) {
            logger.error('[LessonService] Error generando lección', error);
            throw error;
        }
    }

    async _getGranularContext(semanaId, dia, pomodoroIndex) {
        // Lógica extraída de generate-lesson.js
        console.log(`🔍 [LessonService] Extrayendo contexto: S${semanaId}/D${dia}/P${pomodoroIndex}`);

        // Use Repository
        const semanaEncontrada = weekRepository.getWeekDetails(semanaId);
        if (!semanaEncontrada) throw new Error(`Semana ${semanaId} no encontrada`);

        const diaData = semanaEncontrada.esquema_diario?.[dia - 1];
        if (!diaData) throw new Error(`Día ${dia} no encontrado`);

        const textoPomodoro = diaData.pomodoros?.[pomodoroIndex];
        if (!textoPomodoro) throw new Error(`Pomodoro ${pomodoroIndex} no encontrado`);

        return {
            tematica_semanal: semanaEncontrada.titulo_semana,
            concepto_del_dia: diaData.concepto,
            texto_del_pomodoro: textoPomodoro
        };
    }

    _buildPrompt(contexto) {
        return TEMPLATE_PROMPT_UNIVERSAL
            .replace(/{tematica_semanal}/g, contexto.tematica_semanal)
            .replace(/{concepto_del_dia}/g, contexto.concepto_del_dia)
            .replace(/{texto_del_pomodoro}/g, contexto.texto_del_pomodoro);
    }

    _validateContextualCoherence(contexto) {
        const { tematica_semanal, concepto_del_dia, texto_del_pomodoro } = contexto;
        const warnings = [];
        const errors = [];

        // Detectar términos problemáticos (CS50 knowledge leak)
        const problematicTerms = [
            'printf', 'scanf', 'c programming', 'command line', 'terminal',
            'python', 'javascript', 'java', 'compiler', 'gcc',
            'variables', 'functions', 'loops', 'arrays'
        ];

        // Términos esperados para Scratch
        const expectedScratchTerms = [
            'scratch', 'sprite', 'bloques', 'drag', 'drop', 'visual',
            'pensamiento computacional', 'algoritmo', 'secuencia',
            'repetición', 'condicional', 'evento'
        ];

        const contextText = `${tematica_semanal} ${concepto_del_dia} ${texto_del_pomodoro}`.toLowerCase();

        // ❌ Verificar ausencia de términos problemáticos
        const foundProblematic = problematicTerms.filter(term =>
            contextText.includes(term.toLowerCase())
        );

        if (foundProblematic.length > 0) {
            errors.push(`CRÍTICO: Detectados términos de CS50 textual: ${foundProblematic.join(', ')}`);
        }

        // ✅ Verificar presencia de términos esperados para Scratch
        if (contextText.includes('cs50') || contextText.includes('semana 0')) {
            const foundExpected = expectedScratchTerms.filter(term =>
                contextText.includes(term.toLowerCase())
            );

            if (foundExpected.length === 0) {
                warnings.push(`ADVERTENCIA: CS50 Semana 0 detectado pero sin términos de Scratch`);
            }
        }

        // 🔍 Verificar coherencia entre niveles del contexto
        if (tematica_semanal && concepto_del_dia && texto_del_pomodoro) {
            const temaWords = tematica_semanal.toLowerCase().split(' ');
            const conceptWords = concepto_del_dia.toLowerCase().split(' ');
            const pomodoroWords = texto_del_pomodoro.toLowerCase().split(' ');

            const commonWords = temaWords.filter(word =>
                conceptWords.includes(word) || pomodoroWords.includes(word)
            );

            if (commonWords.length === 0) {
                warnings.push('ADVERTENCIA: Posible incoherencia entre niveles de contexto');
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }
}

export const lessonService = new LessonService();
