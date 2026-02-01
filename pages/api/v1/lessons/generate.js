import { withOptionalAuth } from '../../../../utils/authMiddleware';
import { lessonService } from '../../../../lib/services/LessonService';
import { logger } from '../../../../lib/utils/logger';
import { validate } from '../../../../lib/middleware/validate';

/**
 * @api {post} /api/v1/lessons/generate Generar Lección
 * @description Genera una lección educativa basada en el contexto del currículo.
 */
async function handler(req, res) {
    try {
        const { semanaId, dia, diaIndex, pomodoroIndex } = req.body;

        // Normalizar día (soporta 'dia' directo o 'diaIndex')
        const diaFinal = dia || (diaIndex !== undefined ? diaIndex + 1 : null);

        logger.info(`[API v1] Generando lección para S${semanaId}/D${diaFinal}/P${pomodoroIndex}`, { userId: req.authContext?.userId });

        // Delegar al servicio (LessonService ya usa Repositorios y Circuit Breaker internos)
        const result = await lessonService.generateLesson({
            semanaId: Number(semanaId),
            dia: Number(diaFinal),
            pomodoroIndex: Number(pomodoroIndex)
        });

        return res.status(200).json(result);

    } catch (error) {
        logger.error('[API v1] Error generando lección', error);
        return res.status(500).json({
            error: 'Error interno del servidor',
            message: error.message
        });
    }
}

// Esquema de validación
const schema = {
    method: 'POST',
    required: ['semanaId', 'pomodoroIndex'], // dia o diaIndex se validan en lógica pero requerimos mínimos
    types: {
        semanaId: 'number',
        pomodoroIndex: 'number'
    }
};

export default withOptionalAuth(validate(schema, handler));
