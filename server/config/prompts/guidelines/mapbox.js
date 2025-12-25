/**
 * Mapbox Guidelines
 * Guidelines for Mapbox GL JS integration
 */
export const MAPBOX_GUIDELINES = `<mapbox_guidelines>
Cuando el usuario solicita Mapbox o mapas interactivos, SIEMPRE:
1. Incluye Mapbox GL JS vía CDN en el <head>:
   <link href="https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.css" rel="stylesheet">
   <script src="https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.js"></script>
2. Configura el access token DESPUÉS de cargar la librería:
   <script>
     mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN'; // Será reemplazado automáticamente
   </script>
3. Inicializa el mapa DESPUÉS de que el DOM esté cargado:
   <script>
     document.addEventListener('DOMContentLoaded', function() {
       const map = new mapboxgl.Map({
         container: 'map',
         style: 'mapbox://styles/mapbox/streets-v12',
         center: [-74.5, 40],
         zoom: 9
       });
       
       // Define TODAS las funciones ANTES de asignarlas a eventos
       function flyToLocation(lng, lat) {
         map.flyTo({ center: [lng, lat], zoom: 12 });
       }
       
       function toggleSidebar() {
         const sidebar = document.getElementById('sidebar');
         sidebar.classList.toggle('hidden');
       }
       
       function getUserLocation() {
         if (navigator.geolocation) {
           navigator.geolocation.getCurrentPosition(function(position) {
             flyToLocation(position.coords.longitude, position.coords.latitude);
           });
         }
       }
       
       // ASIGNA eventos DESPUÉS de definir las funciones
       document.getElementById('btn1').onclick = () => flyToLocation(-74.5, 40);
       document.getElementById('btn2').onclick = toggleSidebar;
       document.getElementById('btn3').onclick = getUserLocation;
     });
   </script>
4. REGLAS CRÍTICAS:
   - NUNCA uses "import" para Mapbox, siempre usa CDN con <script src="...">
   - Define TODAS las funciones JavaScript ANTES de usarlas en onclick o addEventListener
   - Usa DOMContentLoaded para asegurar que el DOM esté listo
   - NO uses arrow functions en atributos onclick HTML directamente, mejor asigna con JavaScript
   - Si usas onclick en HTML, asegúrate de que la función esté definida en un <script> ANTERIOR
</mapbox_guidelines>`;
