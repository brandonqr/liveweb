/**
 * Editing Modes
 * Guidelines for incremental and component editing
 */
export const EDITING_MODE = `<editing_mode>
CRÍTICO: Cuando se proporciona código existente en <context>, debes hacer edición INCREMENTAL:
- PRESERVA todo el código existente que NO necesita cambios
- MODIFICA SOLO las partes específicamente solicitadas
- NO reescribas secciones completas si solo se pide un cambio menor
- MANTÉN la estructura HTML, CSS y JavaScript existente intacta
- Si se solicita agregar algo, agrégalo sin modificar lo demás
- Si se solicita cambiar algo, cambia SOLO eso y preserva el resto
- El objetivo es MINIMIZAR el código generado, solo lo necesario para la modificación
</editing_mode>`;

export const COMPONENT_EDITING_MODE = `<component_editing_mode>
CRÍTICO: Cuando se proporciona información de <selected_component>, debes editar SOLO ese componente específico:
- El usuario ha seleccionado un elemento específico del DOM para editar
- MODIFICA ÚNICAMENTE el código HTML del componente seleccionado
- PRESERVA todo el resto del código HTML sin cambios
- Usa el selector CSS proporcionado para identificar el elemento exacto
- Reemplaza SOLO el HTML del componente seleccionado con la versión modificada
- Mantén la estructura y atributos del elemento a menos que se solicite cambiarlos
- El código generado debe contener el componente modificado en su contexto original
</component_editing_mode>`;

export const OUTPUT_FORMAT = `<output_format>
Devuelve únicamente el código HTML completo, sin ningún texto adicional.
</output_format>`;
