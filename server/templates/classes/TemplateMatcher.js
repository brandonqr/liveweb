/**
 * TemplateMatcher - Lógica de matching y scoring de templates
 * @module templates/classes/TemplateMatcher
 */

import { SCORING_CONFIG, STOP_WORDS, SPECIFIC_REQUIREMENT_PATTERNS } from '../config.js';

/**
 * Clase para matching inteligente de templates
 */
export class TemplateMatcher {
  /**
   * Calcula el score de coincidencia entre un texto y un template
   * @param {string} text - Texto a analizar
   * @param {Object} template - Template a evaluar
   * @returns {number} Score de coincidencia
   */
  static scoreTemplateMatch(text, template) {
    if (!text || !template) return 0;
    
    const lowerText = text.toLowerCase();
    let score = 0;
    
    // Exact keyword match: +10 points
    if (template.keywords && Array.isArray(template.keywords)) {
      template.keywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
          score += SCORING_CONFIG.KEYWORD_EXACT_MATCH;
          // Bonus si la keyword está al inicio (más relevante)
          const keywordIndex = lowerText.indexOf(keyword);
          if (keywordIndex >= 0 && keywordIndex < 20) {
            score += SCORING_CONFIG.KEYWORD_EARLY_BONUS;
          }
        }
      });
    }
    
    // Synonym match: +5 points
    if (template.synonyms && Array.isArray(template.synonyms)) {
      template.synonyms.forEach(synonym => {
        if (lowerText.includes(synonym.toLowerCase())) {
          score += SCORING_CONFIG.SYNONYM_MATCH;
        }
      });
    }
    
    // Context keyword match: +3 points
    if (template.contextKeywords && Array.isArray(template.contextKeywords)) {
      template.contextKeywords.forEach(ctx => {
        if (lowerText.includes(ctx.toLowerCase())) {
          score += SCORING_CONFIG.CONTEXT_KEYWORD_MATCH;
        }
      });
    }
    
    return score;
  }

  /**
   * Encuentra el mejor template que coincida con el texto dado
   * @param {string} text - Texto a analizar
   * @param {Object} templates - Objeto con todos los templates
   * @returns {Object|null} Template que mejor coincide o null
   */
  static findBestMatch(text, templates) {
    if (!text || !templates || typeof templates !== 'object') {
      return null;
    }

    const lowerText = text.toLowerCase();
    let bestMatch = null;
    let bestScore = SCORING_CONFIG.MIN_SCORE_THRESHOLD;

    // Calcular score para cada template
    for (const [id, template] of Object.entries(templates)) {
      if (!template || typeof template !== 'object') continue;
      
      const score = this.scoreTemplateMatch(text, template);
      
      // También verificar match básico para compatibilidad
      const hasBasicMatch = template.keywords?.some(keyword => 
        lowerText.includes(keyword)
      ) || false;
      
      // Actualizar mejor match si el score es mayor
      if ((score > bestScore || (score === 0 && hasBasicMatch && bestScore === 0)) && 
          (score > 0 || hasBasicMatch)) {
        bestScore = score;
        bestMatch = { ...template, id, matchScore: score };
      }
    }
    
    return bestMatch;
  }

  /**
   * Detecta si un prompt tiene requisitos específicos (no solo genérico)
   * @param {string} prompt - Prompt del usuario
   * @param {Object} template - Template que coincide
   * @returns {boolean} true si tiene requisitos específicos
   */
  static hasSpecificRequirements(prompt, template) {
    if (!prompt || !template) return false;

    const lowerPrompt = prompt.toLowerCase();
    
    // Check for specific patterns
    const hasSpecificPattern = SPECIFIC_REQUIREMENT_PATTERNS.some(pattern => 
      pattern.test(prompt)
    );
    
    // Check for numbers
    const hasNumbers = /\d+/.test(prompt);
    
    // Check for descriptive words that indicate specificity
    const promptWords = lowerPrompt.split(/\s+/);
    const specificWords = promptWords.filter(word => 
      word.length > 3 && 
      !template.keywords?.includes(word) &&
      !template.synonyms?.some(s => s.toLowerCase().includes(word)) &&
      !STOP_WORDS.includes(word)
    );
    
    return hasSpecificPattern || hasNumbers || specificWords.length > 2;
  }
}
