/**
 * SPA Router utility for templates
 * Handles hash-based navigation safely in iframes (about:srcdoc)
 * 
 * @returns {string} JavaScript code for SPA router
 */
export function getSPARouterCode() {
  return `
    // SPA Router - Maneja navegación sin recargar página (compatible con iframes)
    document.addEventListener('DOMContentLoaded', () => {
      // Detectar si estamos en iframe (about:srcdoc tiene origen null)
      const isInIframe = window.location.origin === 'null' || window.location.href.startsWith('about:srcdoc');
      
      // Función segura para actualizar hash (compatible con iframes)
      function updateHash(hash) {
        if (isInIframe) {
          // En iframe, solo actualizar el hash directamente
          window.location.hash = hash;
        } else {
          // En página normal, usar pushState
          try {
            history.pushState(null, '', hash);
          } catch (e) {
            // Fallback si pushState falla
            window.location.hash = hash;
          }
        }
      }
      
      // Prevenir recarga en todos los links con hash
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (href === '#' || href === '') {
            e.preventDefault();
            return;
          }
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId) || document.querySelector(\`[name="\${targetId}"]\`);
          if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Actualizar URL sin recargar
            updateHash(href);
          } else {
            // Si la sección no existe, prevenir navegación y solo usar #
            e.preventDefault();
            updateHash('#');
          }
        });
      });
      
      // Manejar navegación del navegador (back/forward) - solo si no estamos en iframe
      if (!isInIframe) {
        window.addEventListener('popstate', () => {
          const hash = window.location.hash;
          if (hash) {
            const targetElement = document.getElementById(hash.substring(1));
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        });
      }
      
      // Scroll inicial si hay hash en la URL
      if (window.location.hash) {
        const targetElement = document.getElementById(window.location.hash.substring(1));
        if (targetElement) {
          setTimeout(() => targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        } else {
          // Si el hash no corresponde a ningún elemento, limpiarlo
          updateHash('#');
        }
      }
    });
  `;
}
