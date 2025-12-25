/**
 * Clean generated code (remove markdown blocks)
 * @param {string} generatedCode - Raw generated code
 * @returns {string} Cleaned code
 */
export function cleanGeneratedCode(generatedCode) {
  return generatedCode
    .replace(/```html\n?/g, "")
    .replace(/```\n?/g, "")
    .replace(/```html/g, "")
    .trim();
}
