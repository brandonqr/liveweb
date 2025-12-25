/**
 * Template: E-commerce Básico
 * @module templates/ecommerce
 */

export const ecommerceTemplate = {
  id: 'ecommerce',
  name: 'E-commerce Básico',
  description: 'Tienda online con productos y carrito',
  keywords: ['tienda', 'ecommerce', 'productos', 'carrito', 'compras'],
  synonyms: ['tienda online', 'shop', 'comercio', 'venta', 'catálogo'],
  contextKeywords: ['comprar', 'vender', 'productos', 'pedidos', 'checkout'],
  code: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tienda Online</title>
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
      
      // E-commerce functionality
      let cartCount = 0;
      const cartButton = document.querySelector('.cart-button');
      
      // Animaciones
      // Products animation on load
      animate('.product-card', 
        { opacity: [0, 1], y: [40, 0], scale: [0.95, 1] },
        { delay: stagger(0.12), duration: 0.6, easing: [0.4, 0, 0.2, 1] }
      );
      
      // Enhanced product card hover with image zoom
      document.querySelectorAll('.product-card').forEach(card => {
        const image = card.querySelector('.product-image');
        const quickView = card.querySelector('.quick-view');
        
        card.addEventListener('mouseenter', () => {
          animate(card, { y: -8, scale: 1.02 }, { duration: 0.3 });
          animate(image, { scale: 1.1 }, { duration: 0.4 });
          animate(quickView, { opacity: 1, y: 0 }, { duration: 0.3 });
        });
        card.addEventListener('mouseleave', () => {
          animate(card, { y: 0, scale: 1 }, { duration: 0.3 });
          animate(image, { scale: 1 }, { duration: 0.4 });
          animate(quickView, { opacity: 0, y: 10 }, { duration: 0.3 });
        });
      });
      
      // Add to cart with better feedback
      document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
          cartCount++;
          cartButton.innerHTML = \`<span>🛒</span> <span>Carrito</span> <span class="bg-white/20 px-2 py-0.5 rounded-full text-xs">\${cartCount}</span>\`;
          animate(cartButton, { scale: [1, 1.15, 1] }, { duration: 0.4 });
          animate(this, { scale: [1, 0.9, 1] }, { duration: 0.3 });
          
          // Show success feedback
          const originalText = this.textContent;
          this.textContent = '✓ Agregado';
          this.classList.add('bg-emerald-600');
          setTimeout(() => {
            this.textContent = originalText;
            this.classList.remove('bg-emerald-600');
          }, 1500);
        });
      });
    });
  </script>
</head>
<body class="bg-gradient-to-br from-slate-50 to-white min-h-screen">
  <!-- Header with Trust Signals -->
  <header class="bg-white shadow-sm sticky top-0 z-50 border-b border-slate-200">
    <div class="container mx-auto px-4 sm:px-6 py-4">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Mi Tienda
        </h1>
        <div class="flex items-center gap-4">
          <div class="hidden md:flex items-center gap-2 text-sm text-slate-600">
            <span class="text-emerald-600">✓</span>
            <span>Envío gratis</span>
          </div>
          <button class="cart-button relative flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
            <span>🛒</span>
            <span class="hidden sm:inline">Carrito</span>
            <span class="bg-white/20 px-2 py-0.5 rounded-full text-xs">0</span>
          </button>
        </div>
      </div>
    </div>
  </header>
  
  <!-- Trust Banner -->
  <div class="bg-indigo-600 text-white py-2 text-center text-sm">
    <div class="container mx-auto px-4 flex flex-wrap items-center justify-center gap-4">
      <span>✓ Envío gratis en pedidos +$50</span>
      <span class="hidden sm:inline">•</span>
      <span>✓ Devoluciones fáciles</span>
      <span class="hidden sm:inline">•</span>
      <span>✓ Pago seguro</span>
    </div>
  </div>
  
  <!-- Main Content -->
  <main class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Hero Section -->
    <div class="text-center mb-12">
      <h2 class="text-4xl md:text-5xl font-bold mb-4 text-slate-900">Productos Destacados</h2>
      <p class="text-xl text-slate-600">Descubre nuestra selección de productos de alta calidad</p>
    </div>
    
    <!-- Products Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      <div class="product-card group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100">
        <div class="relative overflow-hidden bg-slate-100">
          <img src="https://picsum.photos/500/500?random=1" alt="Producto 1" class="product-image w-full h-80 object-cover transition-transform duration-500" width="500" height="500">
          <div class="quick-view absolute inset-0 bg-black/60 opacity-0 flex items-center justify-center">
            <button class="bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors">
              Vista Rápida
            </button>
          </div>
          <div class="absolute top-4 right-4">
            <span class="px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-semibold">Nuevo</span>
          </div>
        </div>
        <div class="p-6">
          <div class="flex items-center gap-2 mb-2">
            <div class="flex text-yellow-400 text-sm">★★★★★</div>
            <span class="text-sm text-slate-500">(24)</span>
          </div>
          <h3 class="text-xl font-bold mb-2 text-slate-900">Producto Premium</h3>
          <p class="text-slate-600 mb-4 text-sm leading-relaxed">Descripción detallada del producto con características principales y beneficios destacados.</p>
          <div class="flex items-center justify-between mb-4">
            <div>
              <div class="text-3xl font-bold text-indigo-600">$29.99</div>
              <div class="text-sm text-slate-400 line-through">$39.99</div>
            </div>
          </div>
          <button class="add-to-cart w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
            Agregar al Carrito
          </button>
        </div>
      </div>
      
      <div class="product-card group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100">
        <div class="relative overflow-hidden bg-slate-100">
          <img src="https://picsum.photos/500/500?random=2" alt="Producto 2" class="product-image w-full h-80 object-cover transition-transform duration-500" width="500" height="500">
          <div class="quick-view absolute inset-0 bg-black/60 opacity-0 flex items-center justify-center">
            <button class="bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors">
              Vista Rápida
            </button>
          </div>
        </div>
        <div class="p-6">
          <div class="flex items-center gap-2 mb-2">
            <div class="flex text-yellow-400 text-sm">★★★★☆</div>
            <span class="text-sm text-slate-500">(18)</span>
          </div>
          <h3 class="text-xl font-bold mb-2 text-slate-900">Producto Estándar</h3>
          <p class="text-slate-600 mb-4 text-sm leading-relaxed">Descripción detallada del producto con características principales y beneficios destacados.</p>
          <div class="flex items-center justify-between mb-4">
            <div>
              <div class="text-3xl font-bold text-indigo-600">$39.99</div>
            </div>
          </div>
          <button class="add-to-cart w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
            Agregar al Carrito
          </button>
        </div>
      </div>
      
      <div class="product-card group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100">
        <div class="relative overflow-hidden bg-slate-100">
          <img src="https://picsum.photos/500/500?random=3" alt="Producto 3" class="product-image w-full h-80 object-cover transition-transform duration-500" width="500" height="500">
          <div class="quick-view absolute inset-0 bg-black/60 opacity-0 flex items-center justify-center">
            <button class="bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors">
              Vista Rápida
            </button>
          </div>
          <div class="absolute top-4 right-4">
            <span class="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-semibold">-25%</span>
          </div>
        </div>
        <div class="p-6">
          <div class="flex items-center gap-2 mb-2">
            <div class="flex text-yellow-400 text-sm">★★★★★</div>
            <span class="text-sm text-slate-500">(31)</span>
          </div>
          <h3 class="text-xl font-bold mb-2 text-slate-900">Producto Deluxe</h3>
          <p class="text-slate-600 mb-4 text-sm leading-relaxed">Descripción detallada del producto con características principales y beneficios destacados.</p>
          <div class="flex items-center justify-between mb-4">
            <div>
              <div class="text-3xl font-bold text-indigo-600">$49.99</div>
              <div class="text-sm text-slate-400 line-through">$66.99</div>
            </div>
          </div>
          <button class="add-to-cart w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  </main>
</body>
</html>`
};
