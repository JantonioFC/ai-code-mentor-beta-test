import { z } from 'zod';
import { createApiHandler, sendSuccess } from '../../../../lib/api/APIWrapper';
import { withValidation } from '../../../../lib/api/validate';
import { lessonService } from '../../../../lib/services/LessonService';
import { logger } from '../../../../lib/utils/logger';

// Esquema de validación estricto con Zod
const generateLessonSchema = z.object({
    semanaId: z.number().int().positive(),
    dia: z.number().int().min(1).max(7).optional(),
    diaIndex: z.number().int().min(0).max(6).optional(),
    pomodoroIndex: z.number().int().min(0),
    includeMultimodal: z.boolean().optional().default(false),
    useStorytellingPrompt: z.boolean().optional().default(true),
    useLLMJudge: z.boolean().optional().default(false)
}).refine(data => data.dia !== undefined || data.diaIndex !== undefined, {
    message: "Debe proporcionar 'dia' (1-7) o 'diaIndex' (0-6)",
    path: ["dia"]
});

async function handler(req, res) {
    const {
        semanaId, dia, diaIndex, pomodoroIndex,
        includeMultimodal, useStorytellingPrompt, useLLMJudge
    } = req.body;

    // Normalización de día
    const diaFinal = dia || (diaIndex !== undefined ? diaIndex + 1 : 1);

    // Extraer userId
    const userId = req.headers['x-user-id'] || 'anonymous';

    logger.info(`[API v1] Generando lección S${semanaId}/D${diaFinal}/P${pomodoroIndex}`, { userId });

    const result = await lessonService.generateLesson({
        semanaId,
        dia: diaFinal,
        pomodoroIndex,
        userId,
        enrichWithMultimodal: includeMultimodal,
        useStorytellingPrompt,
        useLLMJudge
    });

    return sendSuccess(res, result);
}

// Composición: Validation -> API Wrapper -> Handler
export default createApiHandler(withValidation(generateLessonSchema, handler));
