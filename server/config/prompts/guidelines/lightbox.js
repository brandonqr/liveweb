/**
 * Lightbox/Gallery Guidelines
 * Guidelines for implementing lightboxes and image galleries
 */
export const LIGHTBOX_GUIDELINES = `<lightbox_gallery_guidelines>
Cuando el usuario solicita una galería de imágenes con lightbox o funcionalidad de visualización de imágenes, SIEMPRE:
1. Para lightboxes simples (sin librería externa), implementa un lightbox vanilla JavaScript:
   - Crea funciones para abrir/cerrar el lightbox
   - Define TODAS las funciones ANTES de usarlas en onclick o event listeners
   - NUNCA uses .then() en valores que puedan ser undefined
   - Valida que los elementos existan antes de manipularlos
   - Ejemplo CORRECTO:
     <script>
       // Define funciones PRIMERO
       let currentLightbox = null;
       
       function openLightbox(imageSrc, imageAlt) {
         // Validar que el elemento existe
         const lightbox = document.getElementById('lightbox');
         if (!lightbox) {
           console.error('Lightbox element not found');
           return;
         }
         
         const img = lightbox.querySelector('img');
         if (img) {
           img.src = imageSrc;
           img.alt = imageAlt || '';
           lightbox.style.display = 'flex';
           currentLightbox = lightbox;
         }
       }
       
       function closeLightbox() {
         // Validar que currentLightbox existe antes de usarlo
         if (currentLightbox) {
           currentLightbox.style.display = 'none';
           currentLightbox = null;
         }
       }
       
       // Inicializar DESPUÉS de definir funciones
       document.addEventListener('DOMContentLoaded', function() {
         // Asignar eventos
         document.querySelectorAll('.gallery-item').forEach(item => {
           item.addEventListener('click', function() {
             const img = this.querySelector('img');
             if (img) {
               openLightbox(img.src, img.alt);
             }
           });
         });
         
         // Cerrar con botón o clic fuera
         const closeBtn = document.getElementById('close-lightbox');
         if (closeBtn) {
           closeBtn.onclick = closeLightbox;
         }
         
         const lightbox = document.getElementById('lightbox');
         if (lightbox) {
           lightbox.addEventListener('click', function(e) {
             if (e.target === lightbox) {
               closeLightbox();
             }
           });
         }
       });
     </script>
   
2. REGLAS CRÍTICAS:
   - NUNCA uses .then() en valores que puedan ser undefined
   - SIEMPRE valida que los elementos existan antes de manipularlos
   - Define TODAS las funciones ANTES de asignarlas a eventos
   - Usa variables para mantener estado (ej: currentLightbox) y valídalas antes de usar
   - Si usas async/await, asegúrate de que la función retorne una Promise válida
   - Ejemplo INCORRECTO (causa error):
     function closeLightbox() {
       someUndefinedValue.then(() => { ... }); // ERROR: undefined no tiene .then()
     }
   - Ejemplo CORRECTO:
     function closeLightbox() {
       if (currentLightbox) {
         currentLightbox.style.display = 'none';
       }
     }
   
3. Estructura HTML recomendada:
   <div id="lightbox" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 9999; align-items: center; justify-content: center;">
     <button id="close-lightbox" style="position: absolute; top: 20px; right: 20px; ...">×</button>
     <img src="" alt="" style="max-width: 90%; max-height: 90%; object-fit: contain;">
   </div>
   
4. Para galerías con múltiples imágenes:
   - Usa data attributes para almacenar información
   - Mantén un índice de la imagen actual
   - Implementa navegación prev/siguiente con validación
   - Ejemplo:
     <script>
       let currentIndex = 0;
       const images = [];
       
       function initGallery() {
         document.querySelectorAll('.gallery-item').forEach((item, index) => {
           const img = item.querySelector('img');
           if (img) {
             images.push({ src: img.src, alt: img.alt });
             item.addEventListener('click', () => {
               currentIndex = index;
               openLightbox(images[index].src, images[index].alt);
             });
           }
         });
       }
       
       function nextImage() {
         if (images.length > 0) {
           currentIndex = (currentIndex + 1) % images.length;
           openLightbox(images[currentIndex].src, images[currentIndex].alt);
         }
       }
       
       function prevImage() {
         if (images.length > 0) {
           currentIndex = (currentIndex - 1 + images.length) % images.length;
           openLightbox(images[currentIndex].src, images[currentIndex].alt);
         }
       }
     </script>
</lightbox_gallery_guidelines>`;
