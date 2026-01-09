# 🐳 Arquitectura "Solo Imágenes" - Documentación

## 📋 Resumen

Esta arquitectura asegura que **todo el código (frontend compilado + backend) está empaquetado dentro de la imagen Docker**. El servidor no tiene código fuente ni archivos compilados en carpetas sueltas.

---

## 🏗️ Arquitectura

### Flujo Completo

```
┌─────────────────────────────────────────────────────────┐
│  GitHub Actions (CI/CD)                                  │
│                                                          │
│  1. Compila frontend (npm run build)                    │
│  2. Copia frontend/dist al backend                       │
│  3. Crea UNA SOLA imagen Docker con todo                │
│  4. Push a ghcr.io/brandonqr/liveweb:latest             │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Servidor de Producción                                 │
│                                                          │
│  /opt/liveweb/                                          │
│  ├── docker-compose.yml          (solo config)          │
│  ├── infrastructure/nginx/        (solo configs)        │
│  └── logs/                       (volumen para logs)    │
│                                                          │
│  ❌ NO hay:                                              │
│     - frontend/dist/                                    │
│     - server/                                            │
│     - package.json                                       │
│     - Cualquier código fuente                           │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Contenedores Docker                                    │
│                                                          │
│  ┌──────────────────────────────────────┐               │
│  │  liveweb-backend                     │               │
│  │  (ghcr.io/brandonqr/liveweb:latest)  │               │
│  │                                      │               │
│  │  Contiene:                          │               │
│  │  ├── /app/server/      (código backend)             │
│  │  ├── /app/frontend/dist (frontend compilado)         │
│  │  └── /app/node_modules/ (dependencias)                │
│  │                                      │               │
│  │  Expone: Puerto 3001                │               │
│  │  - API: /api/*                      │               │
│  │  - Frontend: /* (archivos estáticos)│               │
│  └──────────────────────────────────────┘               │
│            │                                            │
│            │ (proxy_pass)                               │
│            ▼                                            │
│  ┌──────────────────────────────────────┐               │
│  │  liveweb-frontend (nginx)             │               │
│  │  (nginx:alpine)                       │               │
│  │                                      │               │
│  │  Solo configuración:                 │               │
│  │  - Proxy reverso a liveweb-backend   │               │
│  │  - NO tiene archivos estáticos       │               │
│  │                                      │               │
│  │  Expone: Puerto 80                   │               │
│  └──────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Archivos Clave

### 1. `Dockerfile` (Multi-stage Build)

```dockerfile
# ETAPA 1: Construcción del Frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build
# Esto genera /app/frontend/dist

# ETAPA 2: Construcción del Backend (Imagen Final)
FROM node:22-alpine AS runner
WORKDIR /app

# Copiar dependencias y código del backend
COPY package*.json ./
RUN npm ci --only=production
COPY server.js ./
COPY server ./server

# ---> LA CLAVE: Copiar el 'dist' del frontend generado en la etapa 1 <---
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 3001
CMD ["node", "server.js"]
```

**✅ Resultado:** Una sola imagen Docker con frontend compilado + backend.

---

### 2. `docker-compose.yml`

```yaml
services:
  liveweb-backend:
    image: ${DOCKER_IMAGE:-ghcr.io/brandonqr/liveweb:latest}
    # Esta imagen YA CONTIENE el frontend compilado dentro
    volumes:
      - ./logs:/app/logs  # Solo logs, NADA de código fuente

  liveweb-frontend:
    image: nginx:alpine
    volumes:
      # AQUÍ ESTÁ EL CAMBIO:
      # Ya NO montamos ./frontend/dist porque esa carpeta no existe en el servidor.
      # Solo montamos la configuración de Nginx.
      - ./infrastructure/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./infrastructure/nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
```

**✅ Resultado:** Nginx no tiene acceso a archivos del disco, solo configuración.

---

### 3. `infrastructure/nginx/default.conf`

```nginx
upstream liveweb_backend {
    server liveweb-backend:3001;
}

server {
    listen 80;
    server_name localhost;

    # Proxy ALL requests to the backend (which serves both API and static files)
    # The backend container has the frontend/dist inside it
    location / {
        proxy_pass http://liveweb_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**✅ Resultado:** Nginx actúa como proxy reverso puro, todo va al backend.

---

### 4. `server/app.js`

```javascript
// Serve static files from frontend/dist in production
// The frontend/dist is packaged INSIDE the Docker image by the Dockerfile
if (process.env.NODE_ENV === 'production') {
  const frontendDistPath = path.join(process.cwd(), 'frontend', 'dist');
  
  if (fs.existsSync(frontendDistPath)) {
    console.log(`✅ Serving frontend from: ${frontendDistPath}`);
    app.use(express.static(frontendDistPath));
    
    // SPA fallback - serve index.html for all non-API routes
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api/') || req.path.startsWith('/health')) {
        return res.status(404).json({ error: 'Endpoint not found' });
      }
      res.sendFile(path.join(frontendDistPath, 'index.html'));
    });
  }
}
```

**✅ Resultado:** Node.js sirve los archivos estáticos desde dentro del contenedor.

---

## 🚀 Flujo de Deployment

### 1. GitHub Actions (Build)

```yaml
- name: Build and push Docker image
  uses: docker/build-push-action@v6
  with:
    context: .
    push: true
    tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
```

**Lo que hace:**
1. Compila el frontend (`npm run build`)
2. Copia `frontend/dist` al backend
3. Crea una imagen Docker con todo
4. Push a `ghcr.io/brandonqr/liveweb:latest`

---

### 2. GitHub Actions (Deploy)

```yaml
- name: Copy config files
  uses: appleboy/scp-action@v0.1.7
  with:
    source: "docker-compose.yml,infrastructure"
    target: "/opt/liveweb/"
```

**Lo que hace:**
- ✅ Copia `docker-compose.yml` (solo configuración)
- ✅ Copia `infrastructure/nginx/` (solo configs de Nginx)
- ❌ **NO copia** `frontend/dist` (no existe en el servidor)
- ❌ **NO copia** código fuente

---

### 3. Servidor (Ejecución)

```bash
# Login a GitHub Container Registry
docker login ghcr.io -u $GITHUB_ACTOR --password-stdin

# Pull la imagen (que contiene TODO)
docker pull ghcr.io/brandonqr/liveweb:latest

# Iniciar contenedores
docker compose up -d --wait
```

**Lo que hace:**
1. Descarga la imagen Docker (con frontend + backend)
2. Inicia `liveweb-backend` (sirve API + frontend estático)
3. Inicia `liveweb-frontend` (nginx como proxy reverso)
4. Nginx redirige todo al backend

---

## ✅ Ventajas de Esta Arquitectura

1. **Seguridad:**
   - No hay código fuente en el servidor
   - No hay archivos compilados sueltos
   - Todo está encerrado en la imagen Docker

2. **Simplicidad:**
   - Un solo artefacto (la imagen Docker)
   - Deployment más simple
   - Rollback fácil (solo cambiar la imagen)

3. **Consistencia:**
   - Misma imagen en todos los ambientes
   - No hay diferencias entre desarrollo y producción
   - Menos errores de configuración

4. **Escalabilidad:**
   - Fácil escalar horizontalmente
   - Solo necesitas más contenedores de la misma imagen
   - Load balancer apunta a múltiples instancias

---

## 🔍 Verificación

### En el Servidor

```bash
# Verificar que NO hay frontend/dist en el servidor
ls -la /opt/liveweb/
# ✅ Debe mostrar: docker-compose.yml, infrastructure/, logs/
# ❌ NO debe mostrar: frontend/, server/, package.json

# Verificar que la imagen contiene el frontend
docker exec liveweb-backend ls -la /app/frontend/dist/
# ✅ Debe mostrar: index.html, assets/, etc.

# Verificar que Nginx es solo proxy
docker exec liveweb-frontend ls -la /usr/share/nginx/html/
# ✅ Debe estar vacío o no existir (nginx no sirve archivos)
```

---

## 📚 Referencias

- [Docker Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [Nginx Reverse Proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- [Express Static Files](https://expressjs.com/en/starter/static-files.html)

---

## 🎯 Resumen Final

**Antes (❌ Incorrecto):**
- Servidor tenía `frontend/dist/` montado como volumen
- Nginx servía archivos del disco
- Código fuente y archivos compilados en el servidor

**Ahora (✅ Correcto):**
- Servidor solo tiene configuraciones
- Frontend compilado está DENTRO de la imagen Docker
- Nginx actúa como proxy reverso puro
- Todo empaquetado en una sola imagen

**¡Esta es la forma profesional y limpia de hacerlo!** 🚀
