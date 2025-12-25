/**
 * Template: Dashboard Moderno
 * @module templates/dashboard
 */

export const dashboardTemplate = {
  id: 'dashboard',
  name: 'Dashboard Moderno',
  description: 'Dashboard profesional con gráficos y métricas',
  keywords: ['dashboard', 'panel', 'métricas', 'gráficos', 'admin'],
  synonyms: ['tablero', 'control panel', 'admin panel', 'analytics', 'estadísticas', 'kpi', 'indicadores'],
  contextKeywords: ['monitoreo', 'seguimiento', 'análisis', 'reportes'],
  code: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard Moderno</title>
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <script type="module">
    import { animate, stagger } from "https://cdn.jsdelivr.net/npm/motion@11.11.17/+esm";
    
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
      // Stagger animation for cards
      animate('.stat-card', 
        { opacity: [0, 1], y: [30, 0], scale: [0.9, 1] },
        { delay: stagger(0.08), duration: 0.6, easing: [0.4, 0, 0.2, 1] }
      );
      
      // Glassmorphism hover effect with microinteractions
      document.querySelectorAll('.stat-card').forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
          animate(card, { 
            scale: 1.03, 
            y: -6,
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
          }, { duration: 0.3 });
          // Pulse animation on icon
          const icon = card.querySelector('.stat-icon');
          if (icon) animate(icon, { scale: [1, 1.1, 1], rotate: [0, 5, 0] }, { duration: 0.4 });
        });
        card.addEventListener('mouseleave', () => {
          animate(card, { scale: 1, y: 0 }, { duration: 0.3 });
        });
      });
      
      // Animate numbers
      document.querySelectorAll('.stat-value').forEach(el => {
        const finalValue = el.textContent;
        animate({ value: 0 }, { 
          value: parseFloat(finalValue.replace(/[^0-9.]/g, '')) 
        }, {
          duration: 1.5,
          onUpdate: (latest) => {
            if (finalValue.includes('$')) {
              el.textContent = '$' + Math.round(latest.value).toLocaleString();
            } else if (finalValue.includes('%')) {
              el.textContent = latest.value.toFixed(2) + '%';
            } else {
              el.textContent = Math.round(latest.value).toLocaleString();
            }
          }
        });
      });
    });
  </script>
  <style>
    .glass-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .gradient-border {
      position: relative;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1px;
      border-radius: 16px;
    }
    .gradient-border > div {
      background: rgba(15, 23, 42, 0.8);
      border-radius: 15px;
    }
  </style>
</head>
<body class="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen text-white">
  <!-- Header with glassmorphism -->
  <header class="glass-card sticky top-0 z-50 border-b border-white/10">
    <div class="container mx-auto px-6 py-4 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Dashboard</h1>
        <p class="text-slate-400 text-sm">Panel de control y métricas</p>
      </div>
      <div class="flex items-center gap-4">
        <div class="px-4 py-2 glass-card rounded-lg text-sm">
          <span class="text-slate-400">Última actualización:</span>
          <span class="text-emerald-400 font-medium">Hace 2 min</span>
        </div>
      </div>
    </div>
  </header>
  
  <main class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Stats Grid with Glassmorphism -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="stat-card gradient-border">
        <div class="p-6 rounded-[15px]">
          <div class="flex items-center justify-between mb-4">
            <div class="stat-icon w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-2xl">
              👥
            </div>
            <div class="px-3 py-1 bg-emerald-500/20 rounded-full">
              <span class="text-emerald-400 text-xs font-semibold">↑ 12.5%</span>
            </div>
          </div>
          <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Usuarios Activos</h3>
          <div class="stat-value text-4xl font-bold text-white mb-1">12,543</div>
          <p class="text-slate-400 text-sm">vs. mes anterior</p>
        </div>
      </div>
      
      <div class="stat-card gradient-border">
        <div class="p-6 rounded-[15px]">
          <div class="flex items-center justify-between mb-4">
            <div class="stat-icon w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-2xl">
              💰
            </div>
            <div class="px-3 py-1 bg-emerald-500/20 rounded-full">
              <span class="text-emerald-400 text-xs font-semibold">↑ 8.2%</span>
            </div>
          </div>
          <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Ingresos</h3>
          <div class="stat-value text-4xl font-bold text-white mb-1">$45,231</div>
          <p class="text-slate-400 text-sm">vs. mes anterior</p>
        </div>
      </div>
      
      <div class="stat-card gradient-border">
        <div class="p-6 rounded-[15px]">
          <div class="flex items-center justify-between mb-4">
            <div class="stat-icon w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-2xl">
              📊
            </div>
            <div class="px-3 py-1 bg-emerald-500/20 rounded-full">
              <span class="text-emerald-400 text-xs font-semibold">↑ 0.4%</span>
            </div>
          </div>
          <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Conversiones</h3>
          <div class="stat-value text-4xl font-bold text-white mb-1">3.24%</div>
          <p class="text-slate-400 text-sm">vs. mes anterior</p>
        </div>
      </div>
      
      <div class="stat-card gradient-border">
        <div class="p-6 rounded-[15px]">
          <div class="flex items-center justify-between mb-4">
            <div class="stat-icon w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-2xl">
              📈
            </div>
            <div class="px-3 py-1 bg-emerald-500/20 rounded-full">
              <span class="text-emerald-400 text-xs font-semibold">↑ 2.1%</span>
            </div>
          </div>
          <h3 class="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Retención</h3>
          <div class="stat-value text-4xl font-bold text-white mb-1">87.3%</div>
          <p class="text-slate-400 text-sm">vs. mes anterior</p>
        </div>
      </div>
    </div>
    
    <!-- Chart Section with Glassmorphism -->
    <div class="gradient-border mb-8">
      <div class="p-8 rounded-[15px]">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-white">Análisis de Rendimiento</h2>
          <div class="flex gap-2">
            <button class="px-4 py-2 glass-card rounded-lg text-sm hover:bg-white/10 transition-colors">7D</button>
            <button class="px-4 py-2 glass-card rounded-lg text-sm hover:bg-white/10 transition-colors">30D</button>
            <button class="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg text-sm">90D</button>
          </div>
        </div>
        <div class="h-80 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-white/10 backdrop-blur-sm">
          <div class="text-center">
            <div class="text-4xl mb-4">📊</div>
            <p class="text-slate-300">Gráfico de rendimiento</p>
            <p class="text-slate-500 text-sm">(integra Chart.js o similar)</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Additional Metrics -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="gradient-border">
        <div class="p-6 rounded-[15px]">
          <h3 class="text-lg font-semibold mb-4 text-white">Actividad Reciente</h3>
          <div class="space-y-4">
            <div class="flex items-center gap-4 p-3 glass-card rounded-lg">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">U</div>
              <div class="flex-1">
                <p class="text-sm font-medium text-white">Nuevo usuario registrado</p>
                <p class="text-xs text-slate-400">Hace 5 minutos</p>
              </div>
            </div>
            <div class="flex items-center gap-4 p-3 glass-card rounded-lg">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">V</div>
              <div class="flex-1">
                <p class="text-sm font-medium text-white">Venta completada</p>
                <p class="text-xs text-slate-400">Hace 12 minutos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="gradient-border">
        <div class="p-6 rounded-[15px]">
          <h3 class="text-lg font-semibold mb-4 text-white">Métricas Rápidas</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center p-3 glass-card rounded-lg">
              <span class="text-slate-300">Tiempo promedio de sesión</span>
              <span class="text-white font-semibold">4:32 min</span>
            </div>
            <div class="flex justify-between items-center p-3 glass-card rounded-lg">
              <span class="text-slate-300">Tasa de rebote</span>
              <span class="text-white font-semibold">32.4%</span>
            </div>
            <div class="flex justify-between items-center p-3 glass-card rounded-lg">
              <span class="text-slate-300">Páginas por sesión</span>
              <span class="text-white font-semibold">3.8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</body>
</html>`
};
