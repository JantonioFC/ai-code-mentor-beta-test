/**
 * @deprecated Legacy Data Access Layer
 * FACADE PATTERN: Re-exports functionality from new Structured Repositories.
 * 
 * Please migrate your imports to:
 * - lib/repositories/WeekRepository
 * - lib/repositories/CurriculumRepository
 * - lib/db
 */
const { weekRepository } = require('./repositories/WeekRepository');
const { curriculumRepository } = require('./repositories/CurriculumRepository');
const db = require('./db'); // The new better-sqlite3 wrapper

// Bind methods to instances to preserve 'this' context if needed (though they rely on db binding)
// Repositories use imported db, so methods are safe to destructure? WeekRepository methods use 'this._helper'.
// So we must call them as methods.

module.exports = {
  // Week Data
  getWeekData: (id) => weekRepository.getWeekData(id),
  getWeekDetails: (id) => weekRepository.getWeekDetails(id),

  // Curriculum Data
  getCurriculumIndex: () => curriculumRepository.getCurriculumIndex(),
  getCurriculumSummary: () => curriculumRepository.getCurriculumSummary(),
  getPhasesOnly: () => curriculumRepository.getPhasesOnly(),

  // Util
  validateDatabase: () => curriculumRepository.validateDatabase(),
  getDatabase: () => {
    // Compatibility: Returns the raw better-sqlite3 instance
    console.warn('⚠️ [DEPRECATED] getDatabase() called. Refactor to use lib/db methods.');
    // Return raw instance, not the wrapper
    return require('./db-instance'); // Direct better-sqlite3 instance
  },

  closeDatabase: () => {
    require('./db').close();
  }
};
