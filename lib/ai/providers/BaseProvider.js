/**
 * Base AI Provider Interface
 * Defines the contract that all AI providers must implement.
 */
export class BaseProvider {
    constructor(config = {}) {
        this.name = config.name || 'unknown-provider';
        this.config = config;
    }

    /**
     * Check if provider is configured and available
     * @returns {boolean}
     */
    isAvailable() {
        throw new Error('Method isAvailable() must be implemented');
    }

    /**
     * Get provider name
     * @returns {string}
     */
    getName() {
        return this.name;
    }

    /**
     * Analyze code
     * @param {Object} request - Analysis request
     * @returns {Promise<Object>} - Analysis result
     */
    async analyze(request) {
        throw new Error('Method analyze() must be implemented');
    }

    /**
     * Parse text response to JSON
     * @param {string} text 
     */
    parseResponse(text) {
        // Default simplistic parser, can be overridden
        try {
            return JSON.parse(text);
        } catch (e) {
            return { raw: text };
        }
    }
}
