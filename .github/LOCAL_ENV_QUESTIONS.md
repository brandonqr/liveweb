# 📋 Respuestas para Configurar Entorno Local

## Respuestas a las 4 Categorías del Experto

### 1. Sistema Operativo y Herramientas

**¿Qué sistema operativo usan los desarrolladores?**
- **macOS** (Apple Silicon M1/M2/M3 o Intel)
- *Nota: El proyecto debería funcionar también en Linux y Windows con WSL2, pero el desarrollo principal es en macOS*

**¿Tienen Docker Desktop instalado y actualizado?**
- **Sí**, Docker Desktop está instalado
- **Docker Compose v2** (moderno, sin guión: `docker compose` en lugar de `docker-compose`)
- *Verificado: El workflow usa `docker compose` (v2)*

**¿Tienen Node.js instalado localmente?**
- **Sí**, Node.js está instalado localmente
- **Versión en Dockerfile:** `node:22-alpine` (Node.js 22)
- **Recomendación:** Los desarrolladores deberían tener Node.js 22 instalado localmente para desarrollo
- *Nota: El experto mencionó v20, pero el Dockerfile actual usa v22*

---

### 2. Red y Puertos

**¿El puerto 80 está libre en sus máquinas?**
- **Probablemente NO** (puerto 80 suele estar ocupado o requiere permisos de administrador)
- **Recomendación:** Usar puerto **8080** o **8000** para mapear el 80 del contenedor en local
- **Configuración sugerida:**
  ```yaml
  # En docker-compose.local.yml
  ports:
    - "8080:80"  # Nginx (frontend)
    - "3001:3001"  # Backend (ya está configurado)
  ```

**¿Necesitan probar con SSL/HTTPS en local?**
- **NO**, HTTP plano es suficiente para desarrollo local
- *Si necesitan HTTPS en el futuro, se puede agregar con mkcert o similar*

---

### 3. Variables de Entorno y Secretos

**¿Tienen un archivo `.env.local` o `.env.example` actualizado?**
- **Sí**, existe `.env.example` con las siguientes variables:
  ```env
  GEMINI_API_KEY=your_gemini_api_key_here
  PORT=3001
  NODE_ENV=production
  API_BASE_URL=http://localhost:3001
  DOMAIN=
  BACKEND_PORT=3001
  FRONTEND_PORT=80
  DOCKER_IMAGE=ghcr.io/brandonqr/liveweb:latest
  ```

**¿La `GEMINI_API_KEY` tiene límites de uso?**
- **Sí**, Google Gemini API tiene límites de uso (cuotas)
- **Recomendación:** Usar una clave de **desarrollo/pruebas** separada para evitar consumir la cuota de producción
- *El experto debería crear una clave de desarrollo específica para pruebas locales*

**¿Qué valor debe tener `API_BASE_URL` en local?**
- **Para Opción A (Simulación de Producción):** `http://localhost:8080` (si mapeamos nginx al 8080)
- **Para Opción B (Desarrollo):** `http://localhost:3001` (acceso directo al backend)
- **Recomendación:** `http://localhost:8080` para que coincida con cómo se accede en producción (a través de nginx)

---

### 4. Propósito del Entorno (Crucial)

**¿Quieren configurar solo la Opción A para validar el despliegue, o necesitan también la Opción B para seguir programando nuevas funciones?**

**Respuesta recomendada:**
- **OPCIÓN A: Simulación de Producción** (Prioridad Alta)
  - ✅ Validar que el Dockerfile funciona correctamente
  - ✅ Validar que Nginx funciona como proxy reverso
  - ✅ Validar que el servidor sirve archivos estáticos correctamente
  - ✅ Asegurar que todo funciona antes de subir a producción
  - **Sin hot-reload** (se reconstruye la imagen al cambiar código)

- **OPCIÓN B: Entorno de Desarrollo** (Prioridad Media - Opcional)
  - Útil para desarrollo día a día
  - Con hot-reload (Vite para frontend, Nodemon para backend)
  - Se puede configurar después si es necesario

**Recomendación:** Empezar con **Opción A** para validar el despliegue, y luego agregar **Opción B** si es necesario para desarrollo activo.

---

## 📝 Resumen para el Experto

```text
Equipo, para configurar el entorno local de pruebas necesitamos definir:

1. OS: macOS (Apple Silicon/Intel) - También compatible con Linux y Windows WSL2
2. Puertos: Preferimos usar puerto 8080 para mapear el 80 del contenedor (evita conflictos)
3. API Keys: Usaremos una GEMINI_API_KEY de desarrollo/pruebas separada (no la de producción)
4. Objetivo: Prioridad en "Simulación de Producción" (Opción A) para validar despliegue.
              Opción B (desarrollo con hot-reload) es opcional y se puede agregar después.

Notas adicionales:
- Node.js en Dockerfile: v22 (no v20)
- Docker Compose: v2 (moderno)
- .env.example existe y está actualizado
- HTTP plano es suficiente (no necesitamos HTTPS en local)
```

---

## 🔧 Configuración Actual del Proyecto

### Dockerfile
- **Base:** `node:22-alpine`
- **Multi-stage build:** Sí (frontend + backend en una imagen)
- **Frontend compilado:** Copiado a `/app/frontend/dist` dentro de la imagen

### docker-compose.yml
- **Backend:** Puerto 3001 (configurable via `BACKEND_PORT`)
- **Frontend (Nginx):** Puerto 80 (configurable via `FRONTEND_PORT`)
- **Red:** `liveweb-network` (bridge)
- **Volúmenes:** Solo `./logs:/app/logs` (no hay código fuente montado)

### Variables de Entorno
- `GEMINI_API_KEY` (requerido)
- `PORT=3001` (backend)
- `NODE_ENV=production`
- `API_BASE_URL` (configurable)
- `DOCKER_IMAGE` (para especificar qué imagen usar)

---

## 🎯 Próximos Pasos

1. El experto creará `docker-compose.local.yml` para entorno local
2. Configurará puertos para evitar conflictos (8080 en lugar de 80)
3. Creará instrucciones para construir la imagen localmente
4. Validará que todo funciona igual que en producción

---

**Última actualización:** $(date)
**Estado:** ✅ Listo para que el experto configure el entorno local
