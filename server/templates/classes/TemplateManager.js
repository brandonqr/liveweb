/**
 * TemplateManager - Gestor principal de templates
 * @module templates/classes/TemplateManager
 */

import { TemplateMatcher } from './TemplateMatcher.js';
import { TemplateValidator } from './TemplateValidator.js';

/**
 * Clase principal para gestionar templates
 * Implementa el patrón Singleton para acceso global
 */
export class TemplateManager {
  /**
   * @param {Object} templates - Objeto con todos los templates
   */
  constructor(templates) {
    if (!templates || typeof templates !== 'object') {
      throw new Error('Templates debe ser un objeto válido');
    }
    
    this.templates = templates;
    this.matcher = TemplateMatcher;
    this.validator = TemplateValidator;
  }

  /**
   * Obtiene un template por ID
   * @param {string} templateId - ID del template
   * @returns {Object|null} Template o null si no existe
   */
  getTemplate(templateId) {
    if (!templateId) return null;
    return this.templates[templateId] || null;
  }

  /**
   * Obtiene todos los templates (solo metadata, sin código)
   * @returns {Array} Lista de templates con metadata
   */
  getAllTemplates() {
    return Object.values(this.templates).map(template => ({
      id: template.id,
      name: template.name,
      description: template.description,
      keywords: template.keywords || [],
      synonyms: template.synonyms || [],
      contextKeywords: template.contextKeywords || []
    }));
  }

  /**
   * Busca el mejor template que coincida con el texto dado
   * @param {string} text - Texto a analizar
   * @returns {Object|null} Template que mejor coincide o null
   */
  findTemplateByKeywords(text) {
    return this.matcher.findBestMatch(text, this.templates);
  }

  /**
   * Calcula el score de coincidencia entre un texto y un template
   * @param {string} text - Texto a analizar
   * @param {Object} template - Template a evaluar
   * @returns {number} Score de coincidencia
   */
  scoreTemplateMatch(text, template) {
    return this.matcher.scoreTemplateMatch(text, template);
  }

  /**
   * Detecta si un prompt tiene requisitos específicos
   * @param {string} prompt - Prompt del usuario
   * @param {Object} template - Template que coincide
   * @returns {boolean} true si tiene requisitos específicos
   */
  hasSpecificRequirements(prompt, template) {
    return this.matcher.hasSpecificRequirements(prompt, template);
  }

  /**
   * Valida la estructura de código generado
   * @param {string} generatedCode - Código HTML generado
   * @param {string} templateId - ID del template
   * @returns {Object} Resultado de validación
   */
  validateTemplateStructure(generatedCode, templateId) {
    const template = this.getTemplate(templateId);
    return this.validator.validateTemplateStructure(generatedCode, templateId, template);
  }

  /**
   * Intenta reparar automáticamente el código generado
   * @param {string} generatedCode - Código HTML generado
   * @param {string} templateId - ID del template
   * @returns {Object} { code: string, fixed: boolean, errors: Array }
   */
  autoFixCode(generatedCode, templateId) {
    const validation = this.validateTemplateStructure(generatedCode, templateId);
    const fixedCode = this.validator.autoFixCode(generatedCode, validation);
    
    return {
      code: fixedCode,
      fixed: fixedCode !== generatedCode,
      errors: validation.errors,
      validation
    };
  }

  /**
   * Valida la definición de un template
   * @param {Object} template - Template a validar
   * @returns {Object} Resultado de validación
   */
  validateTemplateDefinition(template) {
    return this.validator.validateTemplateDefinition(template);
  }

  /**
   * Obtiene el código de un template
   * @param {string} templateId - ID del template
   * @returns {string|null} Código HTML del template o null
   */
  getTemplateCode(templateId) {
    const template = this.getTemplate(templateId);
    return template?.code || null;
  }
}
