# 🐳 Docker Deployment Guide

## ✅ ¿Por qué Docker?

**Ventajas sobre el deployment manual:**

1. ✅ **No necesitas crear directorios manualmente** - El workflow lo hace automáticamente
2. ✅ **Imágenes pre-construidas** - Se construyen en GitHub Actions y se suben al registry
3. ✅ **Consistente con tu infraestructura** - Usa Docker como el resto de tus servicios
4. ✅ **Rollback fácil** - Puedes volver a versiones anteriores fácilmente
5. ✅ **Aislamiento** - La app corre en su propio contenedor
6. ✅ **Reproducible** - Mismo entorno en desarrollo y producción

## 🚀 Workflow: Deploy LiveWeb with Docker

### ¿Qué hace?

1. **Construye la imagen Docker** con el backend y frontend
2. **Sube la imagen** a GitHub Container Registry (`ghcr.io`)
3. **Crea directorios automáticamente** en el servidor
4. **Hace pull de la imagen** en el servidor
5. **Ejecuta docker-compose** para levantar los servicios

### Cómo usarlo

#### Opción 1: Manual (Recomendado para primera vez)

1. Ve a: https://github.com/brandonqr/liveweb/actions/workflows/deploy-docker.yml
2. Click en **"Run workflow"**
3. Selecciona branch: `main`
4. Click en **"Run workflow"**

#### Opción 2: Automático

Se ejecuta automáticamente cuando haces push a `main` o `master`.

## 📋 Requisitos Previos

### GitHub Secrets (Ya configurados)

- ✅ `SERVER_IP` - IP del servidor
- ✅ `SERVER_USER` - Usuario SSH (default: root)
- ✅ `SERVER_PASSWORD` - Contraseña SSH
- ✅ `GEMINI_API_KEY` - API key de Gemini
- ⚠️ `API_BASE_URL` - Opcional (default: http://SERVER_IP:3001)
- ⚠️ `DOMAIN` - Opcional (para dominio personalizado)

### En el Servidor

- ✅ Docker instalado
- ✅ Docker Compose instalado
- ✅ Puerto 3001 disponible

## 🔍 Verificación

Después del deployment, verifica:

```bash
# En el servidor
cd /opt/liveweb
docker-compose ps
docker-compose logs liveweb-backend
curl http://localhost:3001/health
```

## 📦 Estructura de la Imagen

La imagen Docker incluye:
- ✅ Backend (Node.js + Express)
- ✅ Frontend compilado (en `/app/frontend/dist`)
- ✅ Dependencias de producción
- ✅ Health check configurado

## 🔄 Actualizar la Aplicación

Para actualizar:

1. **Opción 1:** Hacer push a `main` (deployment automático)
2. **Opción 2:** Ejecutar el workflow manualmente desde GitHub Actions

El workflow:
- Construye una nueva imagen
- La sube al registry
- Hace pull en el servidor
- Reinicia los contenedores

## 🛠️ Comandos Útiles en el Servidor

```bash
# Ver estado de contenedores
cd /opt/liveweb
docker-compose ps

# Ver logs
docker-compose logs -f liveweb-backend

# Reiniciar servicios
docker-compose restart

# Detener servicios
docker-compose down

# Ver imágenes
docker images | grep liveweb

# Limpiar imágenes antiguas
docker image prune -a
```

## 🆚 Comparación: Docker vs Manual

| Aspecto | Docker | Manual (PM2) |
|---------|--------|--------------|
| Crear directorios | ✅ Automático | ❌ Manual |
| Instalar dependencias | ✅ En la imagen | ❌ En el servidor |
| Rollback | ✅ Fácil (pull imagen anterior) | ⚠️ Más complejo |
| Consistencia | ✅ Mismo entorno siempre | ⚠️ Depende del servidor |
| Aislamiento | ✅ Contenedor aislado | ❌ Proceso en el host |
| Compatibilidad | ✅ Con tu infraestructura | ⚠️ Diferente |

## 🔗 Enlaces Útiles

- **Workflow:** https://github.com/brandonqr/liveweb/actions/workflows/deploy-docker.yml
- **Container Registry:** https://github.com/brandonqr/liveweb/pkgs/container/liveweb
- **Docker Compose:** `/opt/liveweb/docker-compose.yml`
- **Logs:** `docker-compose logs -f`

## ⚠️ Notas Importantes

1. **Primera vez:** El workflow crea automáticamente `/opt/liveweb` y subdirectorios
2. **Imagen:** Se guarda en `ghcr.io/brandonqr/liveweb:latest`
3. **Frontend:** Se copia al servidor para Nginx (si usas frontend separado)
4. **Variables:** Se crean automáticamente en `.env` desde GitHub Secrets

## 🎯 Próximos Pasos

1. ✅ Ejecuta el workflow "Deploy LiveWeb with Docker"
2. ✅ Verifica que los contenedores estén corriendo
3. ✅ Prueba la aplicación en `http://SERVER_IP:3001`
4. ✅ Configura dominio personalizado (opcional)
