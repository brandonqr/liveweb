/**
 * Charts Guidelines
 * Guidelines for Chart.js integration
 */
export const CHARTS_GUIDELINES = `<charts_guidelines>
Cuando el usuario solicita gráficos (barras, donuts, líneas, áreas, etc.), SIEMPRE:
1. Incluye Chart.js vía CDN en el <head> o antes de </body>: <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
2. Crea un elemento <canvas> con un id único para cada gráfico
3. Usa JavaScript para inicializar el gráfico después de que el DOM esté cargado
4. Ejemplos de código:

EJEMPLO GRÁFICO DE BARRAS:
<canvas id="myChart"></canvas>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
        datasets: [{
          label: 'Ventas',
          data: [12, 19, 3, 5, 2],
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  });
</script>

EJEMPLO GRÁFICO DONUT/PIE:
<canvas id="pieChart"></canvas>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('pieChart').getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Rojo', 'Azul', 'Amarillo'],
        datasets: [{
          data: [30, 50, 20],
          backgroundColor: ['#ef4444', '#3b82f6', '#eab308']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' }
        }
      }
    });
  });
</script>

EJEMPLO GRÁFICO DE LÍNEA:
<canvas id="lineChart"></canvas>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('lineChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'],
        datasets: [{
          label: 'Temperatura',
          data: [20, 22, 18, 25, 23],
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: false }
        }
      }
    });
  });
</script>

REGLAS CRÍTICAS:
- SIEMPRE incluye el script de Chart.js antes de usar la librería
- SIEMPRE usa <canvas> con id único para cada gráfico
- SIEMPRE envuelve la inicialización en DOMContentLoaded
- Usa colores modernos y profesionales (rgba con transparencias)
- Haz los gráficos responsive con options.responsive: true
</charts_guidelines>`;
