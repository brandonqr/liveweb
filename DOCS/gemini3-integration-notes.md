# Notas de Integración Gemini 3 Flash - Actualizado

## Información Clave de la Documentación Oficial

### 1. Inicialización del Cliente

```javascript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY 
});
```

**NOTA**: Usar `GoogleGenAI` (no `GoogleGenerativeAI`). El SDK oficial es `@google/genai`.

### 2. Configuración de Thinking Level

Para Gemini 3 Flash, los niveles disponibles son:

- `"minimal"`: Solo Gemini 3 Flash. Máxima velocidad, mínima latencia
- `"low"`: Minimiza latencia y costo. Mejor para instrucciones simples
- `"medium"`: Solo Gemini 3 Flash. Balanceado para la mayoría de tareas
- `"high"`: Por defecto. Maximiza profundidad de razonamiento

**Estructura correcta**:

```javascript
const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: "How does AI work?",
  config: {
    thinkingConfig: {
      thinkingLevel: "low"  // o "minimal" para máxima velocidad
    }
  }
});
```

### 3. Temperature

**IMPORTANTE**: Para Gemini 3, se recomienda mantener `temperature: 1.0` (valor por defecto). 

Cambiar la temperatura (especialmente valores bajos) puede causar:
- Comportamiento inesperado
- Loops o degradación de rendimiento
- Problemas en tareas matemáticas o de razonamiento complejo

```javascript
config: {
  thinkingConfig: {
    thinkingLevel: "low"
  },
  temperature: 1.0  // Mantener en 1.0 (default)
}
```

### 4. Thought Signatures

Los Thought Signatures son importantes para mantener el contexto de razonamiento entre llamadas API.

**Buenas noticias**: Si usas los SDKs oficiales (Python, Node, Java) y el historial de chat estándar, los Thought Signatures se manejan **automáticamente**. No necesitas gestionarlos manualmente.

**Para nuestro caso de uso** (generación de código con contexto):
- El SDK manejará automáticamente los Thought Signatures
- Es importante mantener el historial de conversación si usas múltiples turnos
- Para nuestro caso (cada request es independiente con currentCode), no necesitamos preocuparnos por esto

### 5. Estructura del Endpoint Correcta

```javascript
app.post('/api/generate', async (req, res) => {
  const { prompt, currentCode } = req.body;

  try {
    const SYSTEM_PROMPT = `
Eres un asistente de codificación experto en tiempo real. Tu objetivo es generar aplicaciones web completas en un solo archivo HTML basado en lo que pide el usuario.
- Usa HTML5, CSS (puedes usar estilos en línea o bloques <style>) y JavaScript (ES6+).
- Si el usuario pide 3D o Minecraft, usa Three.js vía CDN.
- Si el usuario pide interacciones físicas, usa librerías como Cannon.js o lógica física simple.
- IMPORTANTE: Devuelve SOLO el código HTML crudo. Sin markdown, sin explicaciones.
- Si el usuario pide generar una imagen, genera un placeholder <img> o usa un color sólido por ahora.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { 
          role: "user", 
          parts: [{ 
            text: `Código actual: ${currentCode || "Vacio"}. Instrucción: ${prompt}` 
          }] 
        }
      ],
      config: {
        thinkingConfig: {
          thinkingLevel: "low"  // Para máxima velocidad en tiempo real
        },
        temperature: 1.0  // Mantener en 1.0 (default recomendado)
      }
    });

    const generatedCode = response.text;
    
    // Limpieza básica por si el modelo devuelve bloques de markdown
    const cleanCode = generatedCode.replace(/```html|```/g, "").trim();

    res.json({ code: cleanCode });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error generando código");
  }
});
```

### 6. Mejores Prácticas de Prompting para Gemini 3

Según la documentación oficial:

- **Sé preciso y directo**: Instrucciones claras y concisas
- **Estructura consistente**: Usa delimitadores claros (XML tags o Markdown)
- **Control de verbosidad**: Por defecto, Gemini 3 es menos verboso. Si necesitas más detalle, pídelo explícitamente
- **Contexto largo**: Si proporcionas mucho contexto (como código actual), pon las instrucciones específicas al **final** del prompt
- **Anclar contexto**: Después de un bloque grande de datos, usa frases como "Based on the information above..."

### 7. System Instructions

Para nuestro caso de uso, el system prompt debe:
- Ser directo y estructurado
- Especificar claramente el formato de salida (solo HTML crudo)
- Incluir reglas específicas (Three.js, Cannon.js, etc.)
- Ser conciso (Gemini 3 responde mejor a instrucciones directas)

### 8. Context Caching (Opcional para el futuro)

Si en el futuro queremos optimizar costos con context caching:
- Gemini 3 Pro Preview requiere mínimo **2,048 tokens** para caching
- Útil cuando el mismo contexto se usa repetidamente
- Para nuestro caso actual (cada request puede tener código diferente), no es necesario

## Resumen de Cambios Necesarios

1. ✅ Usar `GoogleGenAI` de `@google/genai` (no `GoogleGenerativeAI`)
2. ✅ Usar `thinkingConfig.thinkingLevel` (no `thinking_level` o `thinking_budget`)
3. ✅ Mantener `temperature: 1.0` (no cambiarlo)
4. ✅ Estructura correcta: `ai.models.generateContent()` con `config.thinkingConfig`
5. ✅ System prompt directo y estructurado (no over-engineering)
6. ✅ Los Thought Signatures se manejan automáticamente por el SDK
