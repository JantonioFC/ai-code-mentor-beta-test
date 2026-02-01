const db = require('../db');

/**
 * Repository for accessing Week-related data
 * Replaces monolithic curriculum-sqlite.js function
 */
class WeekRepository {

    /**
     * Get basic week data
     * @param {number} weekId 
     */
    getWeekData(weekId) {
        if (!weekId || weekId < 1) return null;

        const query = `
            SELECT 
                s.*,
                m.modulo, m.titulo_modulo,
                f.fase, f.titulo_fase, f.duracion_meses, f.proposito
            FROM semanas s
            JOIN modulos m ON s.modulo_id = m.id  
            JOIN fases f ON m.fase_id = f.id
            WHERE s.semana = ?
        `;

        const weekData = db.get(query, [weekId]);
        if (!weekData) return null;

        const esquemaDiario = db.query(`
            SELECT dia, concepto, pomodoros
            FROM esquema_diario 
            WHERE semana_id = ?
            ORDER BY dia
        `, [weekData.id]);

        return this._mapWeekData(weekData, esquemaDiario);
    }

    /**
     * Get detailed week data (lazy loading optimized)
     * @param {number} weekId 
     */
    getWeekDetails(weekId) {
        if (!weekId || weekId < 1) return null;

        const query = `
            SELECT 
                s.semana, s.titulo_semana, s.objetivos, s.tematica,
                s.actividades, s.entregables, s.recursos, s.official_sources,
                s.ejercicios, s.guia_estudio,
                m.modulo as modulo_numero, m.titulo_modulo,
                f.fase as fase_numero, f.titulo_fase
            FROM semanas s
            JOIN modulos m ON s.modulo_id = m.id  
            JOIN fases f ON m.fase_id = f.id
            WHERE s.semana = ?
        `;

        const weekData = db.get(query, [weekId]);
        if (!weekData) return null;

        const weekInternalId = db.get('SELECT id FROM semanas WHERE semana = ?', [weekId])?.id;

        const esquemaDiarioRaw = db.query(`
            SELECT dia, concepto, pomodoros
            FROM esquema_diario 
            WHERE semana_id = ?
            ORDER BY dia
        `, [weekInternalId]);

        return this._mapWeekDetails(weekData, esquemaDiarioRaw);
    }

    _mapWeekData(weekData, esquemaDiario) {
        return {
            semana: weekData.semana,
            numero: weekData.semana,
            titulo: weekData.titulo_semana,
            tituloSemana: weekData.titulo_semana,
            objetivos: this._parseJSON(weekData.objetivos),
            tematica: weekData.tematica,
            actividades: this._parseJSON(weekData.actividades),
            entregables: weekData.entregables,
            recursos: this._parseJSON(weekData.recursos),
            official_sources: this._parseJSON(weekData.official_sources),
            ejercicios: this._parseJSON(weekData.ejercicios),
            modulo: weekData.modulo,
            tituloModulo: weekData.titulo_modulo,
            fase: weekData.fase,
            tituloFase: weekData.titulo_fase,
            duracionMeses: weekData.duracion_meses,
            proposito: weekData.proposito,
            esquemaDiario: esquemaDiario.map(d => ({
                dia: d.dia,
                concepto: d.concepto,
                pomodoros: this._parseJSON(d.pomodoros)
            })),
            sourceType: 'sqlite-repo',
            dataSource: 'curriculum.db',
            queryTime: new Date().toISOString()
        };
    }

    _mapWeekDetails(weekData, esquemaDiarioRaw) {
        return {
            semana: weekData.semana,
            titulo_semana: weekData.titulo_semana,
            tematica: weekData.tematica,
            objetivos: weekData.objetivos,
            actividades: weekData.actividades,
            entregables: weekData.entregables,
            recursos: weekData.recursos,
            official_sources: weekData.official_sources,
            ejercicios: weekData.ejercicios,
            guia_estudio: weekData.guia_estudio,
            esquema_diario: esquemaDiarioRaw.map(d => ({
                dia: d.dia,
                concepto: d.concepto,
                pomodoros: this._parseJSON(d.pomodoros)
            })),
            modulo_numero: weekData.modulo_numero,
            modulo_titulo: weekData.titulo_modulo,
            fase_numero: weekData.fase_numero,
            fase_titulo: weekData.titulo_fase
        };
    }

    _parseJSON(str) {
        try {
            return typeof str === 'string' ? JSON.parse(str) : (str || []);
        } catch (e) {
            return [];
        }
    }
}

const weekRepository = new WeekRepository();
module.exports = { WeekRepository, weekRepository };
