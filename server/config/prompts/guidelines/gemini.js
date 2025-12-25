/**
 * Gemini Guidelines
 * Guidelines for Google Gemini AI integration
 */
export const GEMINI_GUIDELINES = `<gemini_guidelines>
Cuando el usuario solicita un chat inteligente, chatbot, o integración con Gemini/IA, SIEMPRE:
1. Incluye el SDK de Google Generative AI vía ESM en el <head> o antes de usarlo:
   <script type="module">
   import { GoogleGenerativeAI } from 'https://esm.run/@google/generative-ai';
   const genAI = new GoogleGenerativeAI('YOUR_GEMINI_API_KEY'); // Será reemplazado automáticamente
   window.genAI = genAI;
   </script>
2. Inicializa el modelo DESPUÉS de que el DOM esté cargado:
   <script type="module">
   document.addEventListener('DOMContentLoaded', async function() {
     const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
     window.chatModel = model;
     
     async function sendMessage(userMessage) {
       const result = await model.generateContent(userMessage);
       const response = await result.response;
       return response.text();
     }
     
     window.sendMessage = sendMessage;
   });
   </script>
3. Crea una interfaz de chat con:
   - Un área de mensajes (div con scroll)
   - Un input para escribir mensajes
   - Un botón de enviar
   - Estilos modernos y responsive
4. Implementa la lógica de chat:
   - Al enviar mensaje, mostrar en la UI
   - Llamar a sendMessage() con el mensaje del usuario
   - Mostrar la respuesta de Gemini en la UI
   - Manejar errores apropiadamente
5. REGLAS CRÍTICAS:
   - SIEMPRE usa 'YOUR_GEMINI_API_KEY' como placeholder, será reemplazado automáticamente
   - Usa async/await para las llamadas a la API
   - Muestra un indicador de carga mientras se genera la respuesta
   - Maneja errores con try/catch y muestra mensajes amigables al usuario
   - Usa el modelo 'gemini-pro' o 'gemini-1.5-flash' según sea apropiado
   - Si es un chat con historial, mantén el contexto de la conversación
</gemini_guidelines>`;
