# 🚀 Guía: Simulación Local de Producción

Esta guía te permite probar **exactamente** el mismo entorno que se ejecutará en producción, pero en tu Mac local.

## 📋 Requisitos Previos

- ✅ Docker Desktop instalado y actualizado
- ✅ Docker Compose v2 (moderno, sin guión)
- ✅ Node.js 22 (opcional, solo para desarrollo activo)
- ✅ Puerto 8080 disponible en tu Mac

---

## 🎯 Paso 1: Crear archivo de configuración local

El archivo `docker-compose.local.yml` ya está creado. Este archivo "sobreescribe" la configuración de producción para adaptarla a tu Mac sin tocar el archivo original.

**Características:**
- ✅ Construye la imagen localmente usando el Dockerfile
- ✅ Usa puerto 8080 en lugar de 80 (evita conflictos)
- ✅ No intenta descargar imágenes de internet (`pull_policy: never`)
- ✅ Configura `API_BASE_URL` para localhost

---

## 🔧 Paso 2: Configurar variables de entorno

### Opción A: Crear `.env` desde el ejemplo

```bash
# Copiar el ejemplo
cp .env.local.example .env

# Editar con tu editor favorito
nano .env
# o
code .env
```

### Opción B: Crear manualmente

Crea un archivo `.env` en la raíz del proyecto con este contenido mínimo:

```ini
# Configuración para Simulación Local
GEMINI_API_KEY=tu_clave_de_desarrollo_aqui
PORT=3001
BACKEND_PORT=3001
FRONTEND_PORT=80
NODE_ENV=production
API_BASE_URL=http://localhost:8080
DOMAIN=localhost
```

**⚠️ IMPORTANTE:**
- Usa una **clave de desarrollo/pruebas** de Gemini, NO la de producción
- Esto evita consumir la cuota de producción durante las pruebas

---

## 🚀 Paso 3: Lanzar el entorno

Ejecuta estos comandos en la terminal desde la raíz del proyecto:

```bash
# 1. Limpiar contenedores viejos y huérfanos
docker compose down --remove-orphans

# 2. Construir y levantar usando ambos archivos de configuración
# El flag --build asegura que se recompile la imagen con los últimos cambios de código
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --build --wait
```

**¿Qué hace este comando?**
- `-f docker-compose.yml -f docker-compose.local.yml`: Combina ambos archivos (el local sobreescribe el de producción)
- `--build`: Fuerza la reconstrucción de la imagen con los últimos cambios
- `--wait`: Espera a que los servicios estén saludables antes de terminar
- `-d`: Ejecuta en segundo plano (detached mode)

**Nota para Mac M1/M2/M3:**
- El build será nativo (ARM64), lo cual es perfecto y muy rápido
- No hace falta emular AMD64 para esta prueba de lógica

---

## ✅ Paso 4: Validación (Prueba de Humo Local)

Una vez que el comando termine (gracias al `--wait`), prueba exactamente lo que probarás en producción:

### 1. Frontend
Abre en tu navegador: **http://localhost:8080**

**Resultado esperado:** Debería cargar la web completa.

### 2. Health Check (API)
Abre en tu navegador: **http://localhost:8080/health**

**Resultado esperado:** Debería devolver `{"status":"healthy","timestamp":"..."}`

### 3. Fallback SPA (Crítico) ⚠️
Abre en tu navegador: **http://localhost:8080/ruta-inventada-123**

**Resultado esperado:** 
- ✅ Debería cargar la web (index.html)
- ❌ NO debería mostrar un error 404 de Nginx
- ✅ React/Vue debería manejar el routing del lado del cliente

**Si esto falla:** El fallback SPA no está funcionando correctamente.

### 4. Carga de Archivos (Opcional)
Si tu aplicación permite subir archivos a Gemini, pruébala ahora.

**Resultado esperado:** 
- Nginx local ya tiene la config de `client_max_body_size 10M`
- Debería permitir subir archivos de hasta 10MB

---

## 🔍 Comandos Útiles

### Ver logs de los contenedores

```bash
# Logs del backend
docker compose logs liveweb-backend

# Logs del frontend (nginx)
docker compose logs liveweb-frontend

# Logs de ambos
docker compose logs -f
```

### Ver estado de los contenedores

```bash
docker compose ps
```

### Detener los contenedores

```bash
docker compose down
```

### Reconstruir después de cambios

```bash
# Detener
docker compose down

# Reconstruir y levantar
docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --build --wait
```

### Limpiar todo (imágenes incluidas)

```bash
# Detener y eliminar contenedores
docker compose down --remove-orphans

# Eliminar la imagen local
docker rmi liveweb-simulacion:latest

# Limpiar todo (cuidado: elimina imágenes no usadas)
docker system prune -a
```

---

## 🐛 Troubleshooting

### Error: "Port 8080 is already in use"

**Solución:** Cambia el puerto en `docker-compose.local.yml`:

```yaml
liveweb-frontend:
  ports:
    - "8081:80"  # Usa 8081 en lugar de 8080
```

Y actualiza `API_BASE_URL` en `.env` a `http://localhost:8081`.

### Error: "Cannot connect to Docker daemon"

**Solución:** Asegúrate de que Docker Desktop esté ejecutándose.

### Error: "GEMINI_API_KEY not found"

**Solución:** Verifica que el archivo `.env` existe y tiene la variable `GEMINI_API_KEY` configurada.

### El frontend no carga

**Solución:**
1. Verifica los logs: `docker compose logs liveweb-backend`
2. Verifica que la imagen se construyó correctamente: `docker images | grep liveweb-simulacion`
3. Verifica que el frontend se compiló: `docker compose exec liveweb-backend ls -la /app/frontend/dist/`

### El fallback SPA no funciona (404 en rutas del frontend)

**Solución:**
1. Verifica que `server/app.js` tiene el fallback SPA configurado
2. Verifica los logs del backend: `docker compose logs liveweb-backend | grep -i "fallback\|spa"`
3. Verifica que nginx está redirigiendo correctamente: `docker compose logs liveweb-frontend`

---

## 🎯 ¿Por qué hacemos esto así?

Esta configuración es **segura y profesional**:

1. ✅ **No modificamos el `docker-compose.yml` original** (que se usa en el servidor)
2. ✅ **Probamos exactamente el mismo Dockerfile** y configuración de Nginx que se usará en producción
3. ✅ **Si funciona aquí con `NODE_ENV=production`**, funcionará en el servidor
4. ✅ **Aislamiento completo**: La imagen local no interfiere con la del registro

---

## ✅ Checklist Final

Antes de hacer push a producción, verifica:

- [ ] ✅ Frontend carga correctamente en http://localhost:8080
- [ ] ✅ Health check funciona: http://localhost:8080/health
- [ ] ✅ Fallback SPA funciona: http://localhost:8080/ruta-inventada-123
- [ ] ✅ No hay errores en los logs: `docker compose logs`
- [ ] ✅ Los contenedores están saludables: `docker compose ps`

**Si todo sale en verde, puedes hacer el Push a `main` con total confianza!** 🚀

---

## 📚 Archivos Relacionados

- `docker-compose.yml` - Configuración de producción (no modificar)
- `docker-compose.local.yml` - Configuración local (este archivo)
- `.env.local.example` - Ejemplo de variables de entorno para local
- `Dockerfile` - Imagen Docker que se construye localmente
- `.github/LOCAL_ENV_QUESTIONS.md` - Respuestas a las preguntas del experto

---

**Última actualización:** $(date)
**Estado:** ✅ Listo para usar
