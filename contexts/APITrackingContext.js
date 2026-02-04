/**
 * API TRACKING CONTEXT - Sistema de Monitoreo de Llamadas Gemini
 * MISIÓN CRÍTICA: Control de Costos durante Testing Intensivo
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from '../lib/auth/useAuth'; // Standard import

// Configuración de límites por modelo Gemini
const GEMINI_LIMITS = {
  'gemini-2.5-flash': {
    dailyLimit: 1500,
    resetTime: 'medianoche hora local',
    resetTimezone: 'local'
  },
  'gemini-2.5-pro': {
    dailyLimit: 25,
    resetTime: 'medianoche hora local',
    resetTimezone: 'local'
  },
  'gemini-1.5-flash': {
    dailyLimit: 1500,
    resetTime: 'medianoche hora local',
    resetTimezone: 'local'
  }
};

// Estados del sistema de tracking
const initialState = {
  // Contadores principales
  callsToday: 0,
  dailyLimit: 1500,
  remainingCalls: 1500,

  // Configuración actual
  currentModel: 'gemini-2.5-flash',
  lastResetDate: null,

  // Tracking de sesión
  sessionCalls: 0,
  callHistory: [],

  // Estados de alerta
  alertLevel: 'safe',
  showWarning: false,

  // Tiempo y reseteo
  nextResetTime: null,
  timeUntilReset: null,
  averageCallsPerHour: 0,
  estimatedExhaustionTime: null
};

// Actions para el reducer
const API_TRACKING_ACTIONS = {
  INITIALIZE: 'INITIALIZE',
  RECORD_API_CALL: 'RECORD_API_CALL',
  UPDATE_MODEL: 'UPDATE_MODEL',
  RESET_DAILY_COUNTER: 'RESET_DAILY_COUNTER',
  UPDATE_TIME_METRICS: 'UPDATE_TIME_METRICS',
  SET_ALERT_LEVEL: 'SET_ALERT_LEVEL',
  DISMISS_WARNING: 'DISMISS_WARNING',
  LOAD_PERSISTED_DATA: 'LOAD_PERSISTED_DATA'
};

// Reducer para gestionar el estado
function apiTrackingReducer(state, action) {
  if (!state) return initialState; // Defensive Coding

  switch (action.type) {
    case API_TRACKING_ACTIONS.INITIALIZE:
      return {
        ...state,
        currentModel: action.model,
        dailyLimit: GEMINI_LIMITS[action.model]?.dailyLimit || 1500,
        remainingCalls: (GEMINI_LIMITS[action.model]?.dailyLimit || 1500) - (state.callsToday || 0)
      };

    case API_TRACKING_ACTIONS.RECORD_API_CALL:
      const newCallsToday = (state.callsToday || 0) + 1;
      const newSessionCalls = (state.sessionCalls || 0) + 1; // Safely access sessionCalls
      const newRemainingCalls = (state.dailyLimit || 1500) - newCallsToday;

      const newCallHistory = [
        ...(state.callHistory || []).slice(-49),
        {
          timestamp: new Date().toISOString(),
          model: state.currentModel,
          operation: action.operation || 'generateIRP',
          success: action.success !== false,
          responseTime: action.responseTime || null
        }
      ];

      const newAlertLevel = calculateAlertLevel(newRemainingCalls, state.dailyLimit || 1500);

      return {
        ...state,
        callsToday: newCallsToday,
        sessionCalls: newSessionCalls,
        remainingCalls: newRemainingCalls,
        callHistory: newCallHistory,
        lastCallTime: new Date().toISOString(),
        alertLevel: newAlertLevel,
        showWarning: newAlertLevel !== 'safe' && state.alertLevel === 'safe'
      };

    case API_TRACKING_ACTIONS.UPDATE_MODEL:
      const newLimit = GEMINI_LIMITS[action.model]?.dailyLimit || 1500;
      return {
        ...state,
        currentModel: action.model,
        dailyLimit: newLimit,
        remainingCalls: newLimit - (state.callsToday || 0)
      };

    case API_TRACKING_ACTIONS.RESET_DAILY_COUNTER:
      return {
        ...state,
        callsToday: 0,
        remainingCalls: state.dailyLimit,
        lastResetDate: new Date().toISOString(),
        alertLevel: 'safe',
        showWarning: false,
        callHistory: (state.callHistory || []).filter(call => {
          const callDate = new Date(call.timestamp);
          const resetDate = new Date();
          return callDate.toDateString() === resetDate.toDateString();
        })
      };

    case API_TRACKING_ACTIONS.UPDATE_TIME_METRICS:
      return {
        ...state,
        nextResetTime: action.nextResetTime,
        timeUntilReset: action.timeUntilReset,
        averageCallsPerHour: action.averageCallsPerHour,
        estimatedExhaustionTime: action.estimatedExhaustionTime
      };

    case API_TRACKING_ACTIONS.SET_ALERT_LEVEL:
      return {
        ...state,
        alertLevel: action.level,
        showWarning: action.showWarning !== undefined ? action.showWarning : state.showWarning
      };

    case API_TRACKING_ACTIONS.DISMISS_WARNING:
      return {
        ...state,
        showWarning: false
      };

    case API_TRACKING_ACTIONS.LOAD_PERSISTED_DATA:
      // Robust payload handling
      const safeData = action.data || {};
      return {
        ...state,
        callsToday: typeof safeData.callsToday === 'number' ? safeData.callsToday : (state.callsToday || 0),
        callHistory: Array.isArray(safeData.callHistory) ? safeData.callHistory : (state.callHistory || []),
        sessionCalls: 0 // Reset session on load
      };

    default:
      return state;
  }
}

// Funciones auxiliares
function calculateAlertLevel(remainingCalls, dailyLimit) {
  if (!dailyLimit) return 'safe';
  const usagePercentage = ((dailyLimit - remainingCalls) / dailyLimit) * 100;

  if (remainingCalls <= 0) return 'exhausted';
  if (usagePercentage >= 90) return 'critical';
  if (usagePercentage >= 75) return 'warning';
  return 'safe';
}

function calculateNextResetTime() {
  const now = new Date();
  const nextReset = new Date(now);
  nextReset.setDate(nextReset.getDate() + 1);
  nextReset.setHours(0, 0, 0, 0);
  return nextReset;
}

function formatTimeUntilReset(resetTime) {
  const now = new Date();
  const diff = resetTime - now;
  if (diff <= 0) return "Reseteando...";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

// Context
const APITrackingContext = createContext();

// Provider Component
export function APITrackingProvider({ children }) {
  const [state, dispatch] = useReducer(apiTrackingReducer, initialState);

  // Safe Auth Hook Usage
  let session = null;
  try {
    const auth = useAuth();
    session = auth?.session;
  } catch (e) {
    // Ignore if blocked by strict checks, though it should be fine inside _app
  }

  // Fetch initial stats
  useEffect(() => {
    let mounted = true;

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/usage/stats');
        if (res.ok && mounted) {
          const data = await res.json();
          dispatch({
            type: API_TRACKING_ACTIONS.LOAD_PERSISTED_DATA,
            data: {
              callsToday: data.callsToday,
              callHistory: data.history
            }
          });
        }
      } catch (err) {
        console.error('Failed to load usage stats:', err);
      }
    };

    fetchStats();
    return () => { mounted = false; };
  }, []);

  // Detect Limit Changes
  useEffect(() => {
    const currentModel = process.env.NEXT_PUBLIC_GEMINI_MODEL_NAME || 'gemini-2.5-flash';
    dispatch({ type: API_TRACKING_ACTIONS.INITIALIZE, model: currentModel });
  }, []);

  // Update time metrics
  useEffect(() => {
    const updateTimeMetrics = () => {
      const nextResetTime = calculateNextResetTime();
      const now = new Date();

      const history = state.callHistory || [];
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const recentCalls = history.filter(call => new Date(call.timestamp) > oneDayAgo);
      const averageCallsPerHour = recentCalls.length > 0 ? (recentCalls.length / 24) : 0;

      let estimatedExhaustionTime = null;
      if (averageCallsPerHour > 0 && state.remainingCalls > 0) {
        const hoursToExhaustion = state.remainingCalls / averageCallsPerHour;
        estimatedExhaustionTime = new Date(now.getTime() + hoursToExhaustion * 60 * 60 * 1000);
      }

      dispatch({
        type: API_TRACKING_ACTIONS.UPDATE_TIME_METRICS,
        nextResetTime: nextResetTime.toISOString(),
        timeUntilReset: formatTimeUntilReset(nextResetTime),
        averageCallsPerHour: Math.round(averageCallsPerHour * 10) / 10,
        estimatedExhaustionTime: estimatedExhaustionTime?.toISOString() || null
      });
    };

    updateTimeMetrics();
    const interval = setInterval(updateTimeMetrics, 60000);
    return () => clearInterval(interval);
  }, [state.callHistory, state.remainingCalls]);

  const recordAPICall = async (operation = 'generateIRP', success = true, responseTime = null) => {
    dispatch({
      type: API_TRACKING_ACTIONS.RECORD_API_CALL,
      operation,
      success,
      responseTime
    });

    try {
      await fetch('/api/usage/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: state.currentModel,
          operation,
          success,
          responseTime
        })
      });
    } catch (err) {
      console.error('Failed to sync API call:', err);
    }
  };

  const contextValue = {
    ...state,
    recordAPICall,
    updateModel: (model) => dispatch({ type: API_TRACKING_ACTIONS.UPDATE_MODEL, model }),
    dismissWarning: () => dispatch({ type: API_TRACKING_ACTIONS.DISMISS_WARNING }),
    resetDailyCounter: () => dispatch({ type: API_TRACKING_ACTIONS.RESET_DAILY_COUNTER }),
    getUsagePercentage: () => {
      const limit = state.dailyLimit || 1500;
      return ((limit - state.remainingCalls) / limit) * 100;
    },
    isNearLimit: () => state.remainingCalls <= Math.max(10, (state.dailyLimit || 1500) * 0.1),
    canMakeCall: () => state.remainingCalls > 0,
    currentModelConfig: GEMINI_LIMITS[state.currentModel] || GEMINI_LIMITS['gemini-2.5-flash']
  };

  return (
    <APITrackingContext.Provider value={contextValue}>
      {children}
    </APITrackingContext.Provider>
  );
}

// Hook personalizado
export function useAPITracking() {
  const context = useContext(APITrackingContext);
  if (!context) {
    throw new Error('useAPITracking debe ser usado dentro de un APITrackingProvider');
  }
  return context;
}

export default APITrackingContext;
