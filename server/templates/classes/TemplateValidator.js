/**
 * TemplateValidator - Validación de estructura de templates
 * @module templates/classes/TemplateValidator
 */

import { VALIDATION_CONFIG, AUTO_FIX_CONFIG } from '../config.js';

/**
 * Clase para validar estructura de templates y código generado
 */
export class TemplateValidator {
  /**
   * Valida la estructura de un template después de personalización
   * @param {string} generatedCode - Código HTML generado
   * @param {string} templateId - ID del template
   * @param {Object} template - Template original (opcional, para validación adicional)
   * @returns {Object} Resultado de validación con checks y errores
   */
  static validateTemplateStructure(generatedCode, templateId, template = null) {
    if (!generatedCode || typeof generatedCode !== 'string') {
      return {
        valid: false,
        errors: ['Código generado inválido o vacío'],
        checks: {}
      };
    }

    if (!templateId) {
      return {
        valid: false,
        errors: ['Template ID no proporcionado'],
        checks: {}
      };
    }

    const checks = {
      hasTailwind: generatedCode.includes(VALIDATION_CONFIG.REQUIRED_LIBRARIES.TAILWIND),
      hasMotion: generatedCode.includes(VALIDATION_CONFIG.REQUIRED_LIBRARIES.MOTION),
      hasHTMLStructure: VALIDATION_CONFIG.REQUIRED_HTML_TAGS.some(tag => 
        generatedCode.includes(tag)
      ),
      hasScripts: VALIDATION_CONFIG.REQUIRED_SCRIPTS.some(script => 
        generatedCode.includes(script)
      )
    };
    
    const errors = [];
    if (!checks.hasTailwind) errors.push('Falta Tailwind CSS 4');
    if (!checks.hasMotion) errors.push('Falta Motion library');
    if (!checks.hasHTMLStructure) errors.push('Falta estructura HTML básica');
    if (!checks.hasScripts) errors.push('Faltan scripts');
    
    return {
      valid: Object.values(checks).every(v => v),
      checks,
      errors,
      templateId
    };
  }

  /**
   * Intenta reparar automáticamente el código generado si faltan librerías
   * @param {string} generatedCode - Código HTML generado
   * @param {Object} validationResult - Resultado de validación
   * @returns {string} Código reparado
   */
  static autoFixCode(generatedCode, validationResult) {
    if (!AUTO_FIX_CONFIG.ENABLED) {
      return generatedCode;
    }

    let fixedCode = generatedCode;

    // Restaurar Tailwind CSS si falta
    if (!validationResult.checks.hasTailwind && AUTO_FIX_CONFIG.RESTORE_TAILWIND) {
      const tailwindScript = '<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>';
      fixedCode = fixedCode.replace(
        /<head[^>]*>/i,
        `$&\n  ${tailwindScript}`
      );
    }

    // Restaurar Motion si falta
    if (!validationResult.checks.hasMotion && AUTO_FIX_CONFIG.RESTORE_MOTION) {
      const motionScript = `<script type="module">
    import { animate, scroll, stagger } from "https://cdn.jsdelivr.net/npm/motion@11.11.17/+esm";
    
    document.addEventListener('DOMContentLoaded', () => {
      // Animations initialized
    });
  </script>`;
      fixedCode = fixedCode.replace(/<\/head>/i, `${motionScript}\n  </head>`);
    }

    return fixedCode;
  }

  /**
   * Valida que un template tenga la estructura correcta
   * @param {Object} template - Template a validar
   * @returns {Object} Resultado de validación
   */
  static validateTemplateDefinition(template) {
    const errors = [];
    const warnings = [];

    // Campos requeridos
    if (!template.id) errors.push('Template debe tener un id');
    if (!template.name) errors.push('Template debe tener un name');
    if (!template.code) errors.push('Template debe tener código HTML');
    
    // Campos opcionales pero recomendados
    if (!template.keywords || !Array.isArray(template.keywords) || template.keywords.length === 0) {
      warnings.push('Template debería tener keywords para matching');
    }
    if (!template.description) {
      warnings.push('Template debería tener una descripción');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}
