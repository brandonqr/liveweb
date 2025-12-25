/**
 * Configuración centralizada para el sistema de templates
 * @module templates/config
 */

/**
 * Configuración de scoring para matching de templates
 */
export const SCORING_CONFIG = {
  KEYWORD_EXACT_MATCH: 10,
  KEYWORD_EARLY_BONUS: 5, // Bonus si keyword aparece en primeros 20 caracteres
  SYNONYM_MATCH: 5,
  CONTEXT_KEYWORD_MATCH: 3,
  MIN_SCORE_THRESHOLD: 0 // Score mínimo para considerar match
};

/**
 * Stop words para filtrar palabras irrelevantes en detección de requisitos específicos
 */
export const STOP_WORDS = [
  'crea', 'haz', 'genera', 'hacer', 'crear', 'generar',
  'un', 'una', 'el', 'la', 'de', 'para', 'con', 'del', 'las', 'los',
  'que', 'este', 'esta', 'estos', 'estas', 'por', 'porque'
];

/**
 * Patrones regex para detectar requisitos específicos en prompts
 */
export const SPECIFIC_REQUIREMENT_PATTERNS = [
  /\b(equipos?|productos?|clientes?|usuarios?|proyectos?|ventas|datos|informaci[oó]n)\b/i,
  /\b(gesti[oó]n|administraci[oó]n|control|manejo)\s+(de|del|de la)\s+\w+/i,
  /\bpara\s+\w+/i, // "para X"
  /\bcon\s+\w+/i,  // "con X"
  /\b(moderno|profesional|simple|complejo|avanzado|especializado)\b/i
];

/**
 * Configuración de validación de templates
 */
export const VALIDATION_CONFIG = {
  REQUIRED_LIBRARIES: {
    TAILWIND: '@tailwindcss/browser@4',
    MOTION: 'motion@11.11.17'
  },
  REQUIRED_HTML_TAGS: ['<html', '<body', '<main', '<header'],
  REQUIRED_SCRIPTS: ['<script']
};

/**
 * Configuración de auto-reparación
 */
export const AUTO_FIX_CONFIG = {
  ENABLED: true,
  RESTORE_TAILWIND: true,
  RESTORE_MOTION: true
};
