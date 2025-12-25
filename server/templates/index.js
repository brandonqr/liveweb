/**
 * Sistema de Templates - Entry Point
 * @module templates
 * 
 * Este módulo exporta la API pública del sistema de templates.
 * Internamente usa clases modulares y templates individuales para mejor organización y mantenibilidad.
 */

// Importar clases y configuración
import { TemplateManager } from './classes/TemplateManager.js';
import { TemplateMatcher } from './classes/TemplateMatcher.js';
import { TemplateValidator } from './classes/TemplateValidator.js';

// Importar templates individuales
import { dashboardTemplate } from './templates/dashboard.js';
import { landingTemplate } from './templates/landing.js';
import { portfolioTemplate } from './templates/portfolio.js';
import { blogTemplate } from './templates/blog.js';
import { ecommerceTemplate } from './templates/ecommerce.js';

/**
 * Valida que un template tenga todos los campos requeridos
 * @param {Object} template - Template a validar
 * @param {string} templateName - Nombre del template para mensajes de error
 * @returns {Object} { valid: boolean, errors: Array, warnings: Array }
 */
function validateTemplate(template, templateName) {
  const errors = [];
  const warnings = [];

  // Campos requeridos
  if (!template.id) errors.push(`Template ${templateName}: falta campo 'id'`);
  if (!template.name) errors.push(`Template ${templateName}: falta campo 'name'`);
  if (!template.code || typeof template.code !== 'string' || template.code.trim() === '') {
    errors.push(`Template ${templateName}: falta campo 'code' o está vacío`);
  }

  // Campos opcionales pero recomendados
  if (!template.keywords || !Array.isArray(template.keywords) || template.keywords.length === 0) {
    warnings.push(`Template ${templateName}: debería tener keywords para matching`);
  }
  if (!template.description) {
    warnings.push(`Template ${templateName}: debería tener una descripción`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

// Construir objeto templatesData desde templates individuales
const templatesData = {
  dashboard: dashboardTemplate,
  landing: landingTemplate,
  portfolio: portfolioTemplate,
  blog: blogTemplate,
  ecommerce: ecommerceTemplate
};

// Validar todos los templates al cargar
const validationResults = Object.entries(templatesData).map(([key, template]) => {
  const result = validateTemplate(template, key);
  if (!result.valid) {
    console.error(`❌ [Template Validation] Template '${key}' tiene errores:`, result.errors);
  } else if (result.warnings.length > 0) {
    console.warn(`⚠️ [Template Validation] Template '${key}' tiene advertencias:`, result.warnings);
  }
  return { key, ...result };
});

// Verificar que todos los templates son válidos
const hasErrors = validationResults.some(r => !r.valid);
if (hasErrors) {
  console.error('❌ [Template System] Algunos templates tienen errores. El sistema puede no funcionar correctamente.');
}

// Crear instancia del TemplateManager
const templateManager = new TemplateManager(templatesData);

// ============================================================================
// API PÚBLICA - Mantener compatibilidad hacia atrás
// ============================================================================

/**
 * Objeto con todos los templates (compatibilidad hacia atrás)
 * @type {Object}
 */
export const templates = templatesData;

/**
 * Busca el mejor template que coincida con el texto dado
 * @param {string} text - Texto a analizar
 * @returns {Object|null} Template que mejor coincide o null
 */
export function findTemplateByKeywords(text) {
  return templateManager.findTemplateByKeywords(text);
}

/**
 * Calcula el score de coincidencia entre un texto y un template
 * @param {string} text - Texto a analizar
 * @param {Object} template - Template a evaluar
 * @returns {number} Score de coincidencia
 */
export function scoreTemplateMatch(text, template) {
  return templateManager.scoreTemplateMatch(text, template);
}

/**
 * Obtiene todos los templates (solo metadata, sin código)
 * @returns {Array} Lista de templates con metadata
 */
export function getAllTemplates() {
  return templateManager.getAllTemplates();
}

/**
 * Valida la estructura de un template después de personalización
 * @param {string} generatedCode - Código HTML generado
 * @param {string} templateId - ID del template
 * @returns {Object} Resultado de validación con checks y errores
 */
export function validateTemplateStructure(generatedCode, templateId) {
  return templateManager.validateTemplateStructure(generatedCode, templateId);
}

// ============================================================================
// EXPORTS ADICIONALES - Para uso avanzado
// ============================================================================

/**
 * Obtiene el TemplateManager (para uso avanzado)
 * @returns {TemplateManager} Instancia del TemplateManager
 */
export function getTemplateManager() {
  return templateManager;
}

/**
 * Exportar clases para uso avanzado
 */
export { TemplateManager, TemplateMatcher, TemplateValidator };
