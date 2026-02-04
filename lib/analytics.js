/**
 * Analytics Service (Telemetry)
 * 
 * Centralized wrapper for tracking user events.
 * Currently logs to console, but prepared for Segment/PostHog/GA4.
 */

const IS_DEV = process.env.NODE_ENV === 'development';

export const Analytics = {
    /**
     * Track an event with properties
     * @param {string} eventName - Snake_case event name (e.g., 'challenge_viewed')
     * @param {object} properties - Context data (e.g., { attempt_count: 2 })
     */
    track: (eventName, properties = {}) => {
        try {
            // 1. Log to Console (Dev Mode or Debug)
            if (IS_DEV || typeof window !== 'undefined') {
                const timestamp = new Date().toISOString();
                console.groupCollapsed(`📊 [Analytics] ${eventName}`);
                console.log('Properties:', properties);
                console.log('Timestamp:', timestamp);
                console.groupEnd();
            }

            // 2. Future: Send to Segment/PostHog
            // if (window.analytics) window.analytics.track(eventName, properties);

        } catch (err) {
            console.error('[Analytics] Error tracking event:', err);
        }
    },

    /**
     * Identify a user (post-login)
     * @param {string} userId 
     * @param {object} traits 
     */
    identify: (userId, traits = {}) => {
        try {
            console.log(`👤 [Analytics] Identify: ${userId}`, traits);
            // if (window.analytics) window.analytics.identify(userId, traits);
        } catch (err) {
            console.error('[Analytics] Error identifying user:', err);
        }
    }
};
