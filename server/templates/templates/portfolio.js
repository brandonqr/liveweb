/**
 * Template: Portfolio Personal
 * @module templates/portfolio
 */

export const portfolioTemplate = {
  id: 'portfolio',
  name: 'Portfolio Personal',
  description: 'Portfolio profesional para mostrar proyectos',
  keywords: ['portfolio', 'portafolio', 'proyectos', 'trabajos'],
  synonyms: ['portafolio', 'galería', 'muestra', 'trabajos', 'obras'],
  contextKeywords: ['diseño', 'desarrollo', 'creativo', 'artístico'],
  code: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portfolio Personal</title>
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
      // Hero section animation
      animate('.hero-title', { opacity: [0, 1], y: [-30, 0], scale: [0.9, 1] }, { duration: 0.8 });
      animate('.hero-subtitle', { opacity: [0, 1], y: [20, 0] }, { delay: 0.3, duration: 0.6 });
      
      // Project cards stagger animation on scroll with storytelling
      scroll(animate('.project-card', 
        { opacity: [0, 1], y: [50, 0], scale: [0.9, 1] },
        { delay: stagger(0.15), duration: 0.7, easing: [0.4, 0, 0.2, 1] }
      ));
      
      // Enhanced hover animations with immersive effects
      document.querySelectorAll('.project-card').forEach(card => {
        const overlay = card.querySelector('.project-overlay');
        const image = card.querySelector('.project-image');
        
        card.addEventListener('mouseenter', () => {
          animate(card, { y: -12, scale: 1.03 }, { duration: 0.4 });
          animate(overlay, { opacity: 0 }, { duration: 0.3 });
          animate(image, { scale: 1.1 }, { duration: 0.4 });
        });
        
        card.addEventListener('mouseleave', () => {
          animate(card, { y: 0, scale: 1 }, { duration: 0.4 });
          animate(overlay, { opacity: 1 }, { duration: 0.3 });
          animate(image, { scale: 1 }, { duration: 0.4 });
        });
      });
    });
  </script>
</head>
<body class="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 min-h-screen">
  <!-- Navigation -->
  <nav class="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
    <div class="container mx-auto px-6 py-4 flex items-center justify-between">
      <div class="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
        Portfolio
      </div>
      <div class="hidden md:flex items-center gap-8">
        <a href="#projects" class="text-slate-400 hover:text-white transition-colors">Proyectos</a>
        <a href="#about" class="text-slate-400 hover:text-white transition-colors">Sobre Mí</a>
        <a href="#contact" class="text-slate-400 hover:text-white transition-colors">Contacto</a>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <header class="pt-32 pb-20 text-center">
    <h1 class="hero-title text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6">
      <span class="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        Mi Portfolio
      </span>
    </h1>
    <p class="hero-subtitle text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto">
      Diseñador y Desarrollador creativo especializado en crear experiencias digitales excepcionales
    </p>
  </header>
  
  <!-- Projects Grid -->
  <main id="projects" class="max-w-7xl mx-auto px-4 pb-20">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div class="project-card group relative overflow-hidden rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-500 cursor-pointer">
        <div class="relative h-64 overflow-hidden">
          <div class="project-image absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 transition-transform duration-500"></div>
          <div class="project-overlay absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent transition-opacity duration-300"></div>
          <div class="absolute inset-0 flex items-center justify-center text-7xl opacity-30 group-hover:opacity-50 transition-opacity">
            🎨
          </div>
        </div>
        <div class="p-6 relative z-10">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-2xl font-bold text-white">Diseño Web Moderno</h3>
            <span class="text-xs text-slate-400">2024</span>
          </div>
          <p class="text-slate-400 mb-4 leading-relaxed">
            Plataforma de e-commerce con diseño minimalista y experiencia de usuario optimizada. Incluye sistema de pagos integrado y panel de administración.
          </p>
          <div class="flex gap-2 flex-wrap mb-4">
            <span class="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-medium border border-indigo-500/30">React</span>
            <span class="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium border border-purple-500/30">TypeScript</span>
            <span class="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-xs font-medium border border-pink-500/30">Tailwind</span>
          </div>
          <a href="#" class="text-indigo-400 hover:text-indigo-300 font-semibold text-sm inline-flex items-center gap-2 group/link">
            Ver proyecto
            <span class="group-hover/link:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </div>
      
      <div class="project-card group relative overflow-hidden rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-500 cursor-pointer">
        <div class="relative h-64 overflow-hidden">
          <div class="project-image absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 transition-transform duration-500"></div>
          <div class="project-overlay absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent transition-opacity duration-300"></div>
          <div class="absolute inset-0 flex items-center justify-center text-7xl opacity-30 group-hover:opacity-50 transition-opacity">
            🚀
          </div>
        </div>
        <div class="p-6 relative z-10">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-2xl font-bold text-white">Aplicación Móvil</h3>
            <span class="text-xs text-slate-400">2024</span>
          </div>
          <p class="text-slate-400 mb-4 leading-relaxed">
            App de productividad con sincronización en tiempo real y diseño intuitivo. Más de 50,000 descargas y 4.8 estrellas.
          </p>
          <div class="flex gap-2 flex-wrap mb-4">
            <span class="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs font-medium border border-cyan-500/30">Vue</span>
            <span class="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium border border-blue-500/30">Node.js</span>
          </div>
          <a href="#" class="text-indigo-400 hover:text-indigo-300 font-semibold text-sm inline-flex items-center gap-2 group/link">
            Ver proyecto
            <span class="group-hover/link:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </div>
      
      <div class="project-card group relative overflow-hidden rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-500 cursor-pointer">
        <div class="relative h-64 overflow-hidden">
          <div class="project-image absolute inset-0 bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 transition-transform duration-500"></div>
          <div class="project-overlay absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent transition-opacity duration-300"></div>
          <div class="absolute inset-0 flex items-center justify-center text-7xl opacity-30 group-hover:opacity-50 transition-opacity">
            💡
          </div>
        </div>
        <div class="p-6 relative z-10">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-2xl font-bold text-white">Sistema de Dashboard</h3>
            <span class="text-xs text-slate-400">2024</span>
          </div>
          <p class="text-slate-400 mb-4 leading-relaxed">
            Panel de control empresarial con visualización de datos en tiempo real, reportes personalizados y análisis avanzados.
          </p>
          <div class="flex gap-2 flex-wrap mb-4">
            <span class="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-xs font-medium border border-pink-500/30">Next.js</span>
            <span class="px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full text-xs font-medium border border-rose-500/30">Tailwind</span>
            <span class="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-xs font-medium border border-red-500/30">Chart.js</span>
          </div>
          <a href="#" class="text-indigo-400 hover:text-indigo-300 font-semibold text-sm inline-flex items-center gap-2 group/link">
            Ver proyecto
            <span class="group-hover/link:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </div>
    </div>
  </main>
</body>
</html>`
};
