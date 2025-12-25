/**
 * Check if prompt matches template with specific requirements
 * @param {string} prompt - User prompt
 * @param {Object} matchedTemplate - Matched template
 * @returns {boolean} True if has specific requirements
 */
export function hasSpecificRequirements(prompt, matchedTemplate) {
  const lowerPrompt = prompt.toLowerCase();
  const stopWords = ['crea', 'haz', 'genera', 'hacer', 'crear', 'generar', 'un', 'una', 'el', 'la', 'de', 'para', 'con', 'del', 'las', 'los', 'que', 'este', 'esta'];
  
  // Check for specific entities and descriptive patterns
  const specificPatterns = [
    /\b(equipos?|productos?|clientes?|usuarios?|proyectos?|ventas|datos|informaci[oó]n)\b/i,
    /\b(gesti[oó]n|administraci[oó]n|control|manejo)\s+(de|del|de la)\s+\w+/i,
    /\bpara\s+\w+/i, // "para X"
    /\bcon\s+\w+/i,  // "con X"
    /\b(moderno|profesional|simple|complejo|avanzado|especializado)\b/i
  ];
  
  const hasSpecificPattern = specificPatterns.some(pattern => pattern.test(prompt));
  const hasNumbers = /\d+/.test(prompt);
  
  // Check for words that indicate specificity (not just template name)
  const promptWords = lowerPrompt.split(/\s+/);
  const specificWords = promptWords.filter(word => 
    word.length > 3 && 
    !matchedTemplate.keywords?.includes(word) &&
    !matchedTemplate.synonyms?.some(s => s.toLowerCase().includes(word)) &&
    !stopWords.includes(word)
  );
  
  return hasSpecificPattern || hasNumbers || specificWords.length > 2;
}
