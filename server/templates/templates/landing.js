/**
 * Template: Landing Page Moderna
 * @module templates/landing
 */

export const landingTemplate = {
  id: 'landing',
  name: 'Landing Page Moderna',
  description: 'Landing page profesional con hero section y CTA',
  keywords: ['landing', 'página', 'inicio', 'hero', 'cta'],
  synonyms: ['landing page', 'página principal', 'homepage', 'portada', 'presentación'],
  contextKeywords: ['conversión', 'marketing', 'promoción', 'ventas'],
  code: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Landing Page Moderna</title>
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
      // Hero animations with more impact
      animate('.hero-title', { 
        opacity: [0, 1], 
        y: [-30, 0],
        scale: [0.95, 1]
      }, { duration: 0.8, easing: [0.4, 0, 0.2, 1] });
      
      animate('.hero-subtitle', { 
        opacity: [0, 1], 
        y: [30, 0] 
      }, { delay: 0.3, duration: 0.8 });
      
      animate('.hero-cta', { 
        opacity: [0, 1], 
        scale: [0.8, 1],
        y: [20, 0]
      }, { delay: 0.5, duration: 0.6 });
      
      // Social proof animation
      animate('.social-proof', { 
        opacity: [0, 1] 
      }, { delay: 0.7, duration: 0.6 });
      
      // Feature cards animation on scroll
      scroll(animate('.feature-card', 
        { opacity: [0, 1], y: [40, 0], scale: [0.95, 1] },
        { delay: stagger(0.12), duration: 0.7, easing: [0.4, 0, 0.2, 1] }
      ));
      
      // Enhanced CTA button micro-interactions
      const ctaButtons = document.querySelectorAll('.cta-button');
      ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
          animate(button, { 
            scale: 1.05, 
            y: -3,
            boxShadow: '0 20px 40px rgba(99, 102, 241, 0.4)'
          }, { duration: 0.3 });
        });
        button.addEventListener('mouseleave', () => {
          animate(button, { scale: 1, y: 0 }, { duration: 0.3 });
        });
        button.addEventListener('click', () => {
          animate(button, { scale: [1, 0.95, 1] }, { duration: 0.3 });
        });
      });
    });
  </script>
</head>
<body class="text-slate-900 bg-white">
  <!-- Navigation -->
  <nav class="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
    <div class="container mx-auto px-6 py-4 flex items-center justify-between">
      <div class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Brand
      </div>
      <div class="hidden md:flex items-center gap-8">
        <a href="#features" class="text-slate-600 hover:text-indigo-600 transition-colors">Características</a>
        <a href="#testimonials" class="text-slate-600 hover:text-indigo-600 transition-colors">Testimonios</a>
        <a href="#pricing" class="text-slate-600 hover:text-indigo-600 transition-colors">Precios</a>
        <a href="#contacto" class="cta-button bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all">
          Comenzar
        </a>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
    <!-- Animated Background -->
    <div class="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"></div>
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.1),transparent_50%)]"></div>
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]"></div>
    
    <div class="relative max-w-6xl mx-auto px-4 py-20 text-center">
      <!-- Badge -->
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full mb-6">
        <span class="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
        <span class="text-sm font-semibold text-indigo-700">Nuevo: Lanzamiento 2025</span>
      </div>
      
      <h1 class="hero-title text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight">
        <span class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Transforma tu Negocio
        </span>
      </h1>
      
      <p class="hero-subtitle text-xl md:text-2xl lg:text-3xl mb-8 text-slate-600 max-w-3xl mx-auto leading-relaxed">
        La solución perfecta para llevar tu empresa al siguiente nivel con tecnología de vanguardia y diseño excepcional
      </p>
      
      <!-- CTAs -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
        <a href="#contacto" class="hero-cta cta-button bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300">
          Comenzar Ahora
        </a>
        <a href="#demo" class="px-8 py-4 rounded-full font-semibold text-lg border-2 border-slate-300 hover:border-indigo-600 hover:text-indigo-600 transition-all">
          Ver Demo
        </a>
      </div>
      
      <!-- Social Proof -->
      <div class="social-proof flex flex-col sm:flex-row items-center justify-center gap-8 text-slate-500">
        <div class="flex items-center gap-2">
          <div class="flex -space-x-2">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 border-2 border-white"></div>
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white"></div>
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-red-400 border-2 border-white"></div>
          </div>
          <span class="text-sm font-medium">+10,000 usuarios</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="flex text-yellow-400">★★★★★</div>
          <span class="text-sm font-medium">4.9/5 de 2,500+ reseñas</span>
        </div>
      </div>
    </div>
  </section>
  
  <!-- Features Section -->
  <section id="features" class="py-24 px-4 bg-white">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-slate-900">
          Características Principales
        </h2>
        <p class="text-xl text-slate-600 max-w-2xl mx-auto">
          Todo lo que necesitas para hacer crecer tu negocio
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="feature-card group p-8 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 hover:border-indigo-300 hover:shadow-2xl transition-all duration-300">
          <div class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            ⚡
          </div>
          <h3 class="text-2xl font-bold mb-4 text-slate-900">Rápido</h3>
          <p class="text-slate-600 leading-relaxed">Rendimiento optimizado para máxima velocidad y eficiencia en cada interacción</p>
        </div>
        
        <div class="feature-card group p-8 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 hover:border-purple-300 hover:shadow-2xl transition-all duration-300">
          <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            🔒
          </div>
          <h3 class="text-2xl font-bold mb-4 text-slate-900">Seguro</h3>
          <p class="text-slate-600 leading-relaxed">Protección de datos de nivel empresarial con encriptación de extremo a extremo</p>
        </div>
        
        <div class="feature-card group p-8 rounded-3xl bg-gradient-to-br from-pink-50 to-red-50 border border-pink-100 hover:border-pink-300 hover:shadow-2xl transition-all duration-300">
          <div class="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            📈
          </div>
          <h3 class="text-2xl font-bold mb-4 text-slate-900">Escalable</h3>
          <p class="text-slate-600 leading-relaxed">Crece con tu negocio sin límites, desde startups hasta empresas globales</p>
        </div>
      </div>
    </div>
  </section>
</body>
</html>`
};
