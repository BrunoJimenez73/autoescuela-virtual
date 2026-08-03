// ===========================================
// Constantes centralizadas del servidor
// ===========================================

// --- Límites de preguntas ---
export const LIMITES_PREGUNTAS = {
  MIN: 1,
  MAX_POR_EXAMEN: 100,
  MAX_ALEATORIAS: 200,
  DEFAULT: 30,
} as const;

// --- Rate limiting ---
export const RATE_LIMIT = {
  VENTANA_LOGIN_MS: 15 * 60 * 1000, // 15 minutos
  MAX_INTENTOS_LOGIN: 10,
} as const;

// --- JWT ---
export const JWT_EXPIRACION = '7d';

// --- Exámenes ---
export const EXAMENES = {
  MAX_HISTORIAL: 50,
  MAX_EXAMENES_RECIENTES: 10,
  // Límite absoluto de duración declarada por el client (3 horas)
  DURACION_MAX_SEG: 3 * 3600,
} as const;

// --- Progreso ---
export const PROGRESO = {
  MAX_DEBILES: 5,
} as const;

// --- Paginación y límites genéricos ---
export const PAGINACION = {
  DEFAULT_LIMIT: 50,
} as const;
