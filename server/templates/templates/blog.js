/**
 * Template: Blog Moderno
 * @module templates/blog
 */

export const blogTemplate = {
  id: 'blog',
  name: 'Blog Moderno',
  description: 'Blog con diseño limpio y moderno',
  keywords: ['blog', 'artículos', 'posts', 'publicaciones'],
  synonyms: ['bitácora', 'diario', 'noticias', 'entradas', 'posts'],
  contextKeywords: ['contenido', 'escritura', 'noticias', 'artículos'],
  code: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog Moderno</title>
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <script type="module">
    import { animate, scroll, stagger } from "https://cdn.jsdelivr.net/npm/motion@11.11.17/+esm";
    
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
      
      // Animaciones
      // Posts animation on scroll with better timing
      scroll(animate('.post-card', 
        { opacity: [0, 1], y: [40, 0] },
        { delay: stagger(0.2), duration: 0.7, easing: [0.4, 0, 0.2, 1] }
      ));
      
      // Enhanced hover animations
      document.querySelectorAll('.post-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
          animate(card, { y: -6, scale: 1.01 }, { duration: 0.3 });
          const image = card.querySelector('.post-image');
          if (image) animate(image, { scale: 1.05 }, { duration: 0.4 });
        });
        card.addEventListener('mouseleave', () => {
          animate(card, { y: 0, scale: 1 }, { duration: 0.3 });
          const image = card.querySelector('.post-image');
          if (image) animate(image, { scale: 1 }, { duration: 0.4 });
        });
      });
    });
  </script>
  <style>
    /* Typography best practices: optimal line length and spacing */
    .post-content {
      max-width: 65ch; /* Optimal reading width: 45-75 characters */
      line-height: 1.7; /* 1.4-1.6x font size for readability */
    }
    .post-title {
      line-height: 1.2; /* Tighter for headings */
    }
  </style>
</head>
<body class="bg-gradient-to-br from-slate-50 to-white min-h-screen">
  <!-- Navigation -->
  <nav class="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
    <div class="container mx-auto px-6 py-4 flex items-center justify-between">
      <h1 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Mi Blog
      </h1>
      <div class="hidden md:flex items-center gap-6">
        <a href="#home" class="text-slate-600 hover:text-indigo-600 transition-colors">Inicio</a>
        <a href="#categories" class="text-slate-600 hover:text-indigo-600 transition-colors">Categorías</a>
        <a href="#about" class="text-slate-600 hover:text-indigo-600 transition-colors">Sobre</a>
      </div>
    </div>
  </nav>
  
  <!-- Hero Section -->
  <header class="py-16 px-4 text-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
    <h2 class="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
      Artículos y Pensamientos
    </h2>
    <p class="text-xl text-slate-600 max-w-2xl mx-auto">
      Explorando ideas, compartiendo conocimiento y descubriendo nuevas perspectivas
    </p>
  </header>
  
  <!-- Main Content -->
  <main class="container mx-auto px-4 py-12 max-w-4xl">
    <article class="post-card group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 mb-12">
      <div class="relative overflow-hidden">
        <img src="https://picsum.photos/800/450?random=1" alt="Post image" class="post-image w-full h-80 object-cover transition-transform duration-500" width="800" height="450">
        <div class="absolute top-4 left-4">
          <span class="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-indigo-600">
            Tecnología
          </span>
        </div>
      </div>
      <div class="p-8">
        <div class="flex items-center gap-4 text-sm text-slate-500 mb-4">
          <span class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400"></span>
            <span>Autor</span>
          </span>
          <span>•</span>
          <span>15 de Enero, 2025</span>
          <span>•</span>
          <span>5 min lectura</span>
        </div>
        <h2 class="post-title text-4xl font-bold mb-4 text-slate-900 leading-tight">
          Título del Artículo: Una Guía Completa sobre Diseño Moderno
        </h2>
        <div class="post-content text-slate-600 mb-6 text-lg">
          <p class="mb-4">
            Resumen o extracto del artículo. Aquí puedes escribir una introducción que capture la atención del lector y lo invite a continuar leyendo. Este es un ejemplo de texto con la longitud óptima de línea para facilitar la lectura.
          </p>
          <p>
            El contenido continúa aquí con más información relevante que mantiene al lector interesado y proporciona contexto adicional sobre el tema principal del artículo.
          </p>
        </div>
        <a href="#" class="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors group/link">
          Leer artículo completo
          <span class="group-hover/link:translate-x-1 transition-transform">→</span>
        </a>
      </div>
    </article>
    
    <article class="post-card group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 mb-12">
      <div class="relative overflow-hidden">
        <img src="https://picsum.photos/800/450?random=2" alt="Post image" class="post-image w-full h-80 object-cover transition-transform duration-500" width="800" height="450">
        <div class="absolute top-4 left-4">
          <span class="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-purple-600">
            Diseño
          </span>
        </div>
      </div>
      <div class="p-8">
        <div class="flex items-center gap-4 text-sm text-slate-500 mb-4">
          <span class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400"></span>
            <span>Autor</span>
          </span>
          <span>•</span>
          <span>12 de Enero, 2025</span>
          <span>•</span>
          <span>3 min lectura</span>
        </div>
        <h2 class="post-title text-4xl font-bold mb-4 text-slate-900 leading-tight">
          Otro Artículo Interesante sobre Tendencias Actuales
        </h2>
        <div class="post-content text-slate-600 mb-6 text-lg">
          <p class="mb-4">
            Resumen o extracto del artículo. Aquí puedes escribir una introducción que capture la atención del lector y proporcione un vistazo del contenido principal.
          </p>
        </div>
        <a href="#" class="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors group/link">
          Leer artículo completo
          <span class="group-hover/link:translate-x-1 transition-transform">→</span>
        </a>
      </div>
    </article>
  </main>
</body>
</html>`
};
