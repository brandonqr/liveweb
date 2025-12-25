/**
 * Determine optimal thinking level for Gemini 3 Flash based on task complexity
 * @param {Object} params - Task parameters
 * @param {string} params.prompt - User prompt
 * @param {string} params.currentCode - Current code
 * @param {Object} params.selectedComponent - Selected component
 * @returns {string} Thinking level: "minimal" | "low" | "medium" | "high"
 */
export function selectThinkingLevel({ prompt, currentCode, selectedComponent }) {
  // For component editing (very specific, small scope)
  if (selectedComponent) {
    return 'minimal'; // Fastest for focused edits
  }
  
  // For new code generation (simple tasks)
  if (!currentCode || currentCode.trim() === '' || currentCode === '<!-- Di algo para empezar -->') {
    const promptLength = prompt.length;
    const isSimple = promptLength < 100 && !prompt.toLowerCase().includes('complejo') && !prompt.toLowerCase().includes('avanzado');
    
    if (isSimple) {
      return 'minimal'; // Fastest for simple new code
    }
    return 'low'; // Default for new code
  }
  
  // For incremental edits
  const codeSize = currentCode.length;
  const promptComplexity = prompt.length;
  
  // Small edits on small code
  if (codeSize < 5000 && promptComplexity < 200) {
    return 'minimal';
  }
  
  // Medium complexity edits
  if (codeSize < 20000 && promptComplexity < 500) {
    return 'low';
  }
  
  // Complex edits or large codebase
  if (codeSize > 20000 || promptComplexity > 500) {
    return 'medium'; // Better reasoning for complex tasks
  }
  
  // Default
  return 'low';
}
