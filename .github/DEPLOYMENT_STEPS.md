# 🚀 Pasos para Deployment a Producción

## ✅ Estado Actual

- ✅ Entorno local funcionando correctamente
- ✅ Todas las validaciones pasadas
- ✅ Código listo para producción

---

## 📋 Checklist Pre-Deployment

Antes de hacer el deployment, verifica:

- [ ] ✅ Código commiteado y pusheado a `main`
- [ ] ✅ Todos los tests pasan (si existen)
- [ ] ✅ GitHub Secrets configurados correctamente:
  - [ ] `SERVER_IP`
  - [ ] `SERVER_USER` (opcional, default: root)
  - [ ] `SERVER_PASSWORD`
  - [ ] `GEMINI_API_KEY` (clave de PRODUCCIÓN, no la de desarrollo)
  - [ ] `API_BASE_URL` (opcional)
  - [ ] `DOMAIN` (opcional, si tienes dominio personalizado)
- [ ] ✅ Docker y Docker Compose instalados en el servidor
- [ ] ✅ Puerto 3001 disponible en el servidor

---

## 🚀 Opción 1: Deployment Automático (Recomendado)

### Cuando haces push a `main`:

El workflow `deploy-docker.yml` se ejecuta automáticamente cuando:
- Haces `git push origin main`
- O haces push a la rama `master`

**No necesitas hacer nada más**, el workflow:
1. Construye la imagen Docker
2. La sube a GitHub Container Registry
3. Hace deploy al servidor automáticamente

---

## 🚀 Opción 2: Deployment Manual

Si quieres ejecutar el deployment manualmente:

### Paso 1: Ir a GitHub Actions

1. Ve a: https://github.com/brandonqr/liveweb/actions
2. Selecciona el workflow: **"Deploy LiveWeb with Docker"**
3. Click en **"Run workflow"**
4. Selecciona branch: `main`
5. Click en **"Run workflow"**

### Paso 2: Monitorear el Deployment

1. El workflow mostrará el progreso en tiempo real
2. Verás los logs de:
   - Build de la imagen Docker
   - Push al registry
   - Deploy al servidor
   - Health checks

### Paso 3: Verificar Deployment

Una vez completado, verifica:

```bash
# En el servidor (o usando el workflow diagnose.yml)
curl http://TU_SERVER_IP:3001/health
curl http://TU_SERVER_IP:3001/api/templates
```

---

## 🔍 Verificación Post-Deployment

### Usando el Workflow de Diagnóstico

1. Ve a: https://github.com/brandonqr/liveweb/actions/workflows/diagnose.yml
2. Click en **"Run workflow"**
3. Esto ejecutará diagnósticos completos en el servidor

### Verificación Manual

```bash
# SSH al servidor
ssh root@TU_SERVER_IP

# Verificar contenedores
cd /opt/liveweb
docker compose ps

# Ver logs
docker compose logs liveweb-backend --tail=50
docker compose logs liveweb-frontend --tail=50

# Verificar endpoints
curl http://localhost:3001/health
curl http://localhost:3001/api/templates
```

---

## 🌐 Acceso a la Aplicación

Después del deployment exitoso:

### Si tienes dominio personalizado:
- **Frontend:** `https://tu-dominio.com` (si configuraste SSL)
- **Backend API:** `https://tu-dominio.com/api/*`

### Si NO tienes dominio:
- **Frontend:** `http://TU_SERVER_IP:80` (si nginx está en puerto 80)
- **Backend API:** `http://TU_SERVER_IP:3001/api/*`

**Nota:** El puerto 80 puede requerir permisos de administrador. Si no funciona, usa el puerto 3001 directamente.

---

## 🐛 Troubleshooting

### Si el deployment falla:

1. **Revisa los logs del workflow:**
   - Ve a la pestaña "Actions" en GitHub
   - Click en el workflow fallido
   - Revisa los logs de cada step

2. **Usa el workflow de diagnóstico:**
   - Ejecuta `diagnose.yml` para obtener información detallada

3. **Problemas comunes:**
   - **Error de autenticación:** Verifica que `SERVER_PASSWORD` esté correcto
   - **Error de puerto:** Verifica que el puerto 3001 esté disponible
   - **Error de Docker:** Verifica que Docker esté instalado en el servidor
   - **Error de API key:** Verifica que `GEMINI_API_KEY` sea la de producción

---

## 📝 Notas Importantes

### API Keys

- **Desarrollo:** Usa una clave de desarrollo en `.env` local
- **Producción:** Usa una clave de producción en GitHub Secrets
- **Nunca** uses la misma clave para ambos ambientes

### Rollback

Si necesitas hacer rollback a una versión anterior:

```bash
# En el servidor
cd /opt/liveweb
docker compose down
docker pull ghcr.io/brandonqr/liveweb:COMMIT_SHA_ANTERIOR
docker compose up -d
```

O simplemente haz push de un commit anterior a `main` y el workflow lo desplegará automáticamente.

---

## ✅ Checklist Post-Deployment

Después del deployment, verifica:

- [ ] ✅ Health check responde: `http://TU_SERVER_IP:3001/health`
- [ ] ✅ Frontend carga: `http://TU_SERVER_IP:80` o `http://TU_SERVER_IP:8080`
- [ ] ✅ API endpoints funcionan: `/api/templates`, `/api/generate`
- [ ] ✅ Fallback SPA funciona (rutas del frontend)
- [ ] ✅ Contenedores están `healthy`
- [ ] ✅ Logs no muestran errores críticos

---

## 🎯 Resumen

**Para hacer deployment ahora:**

1. **Asegúrate de que todo está commiteado:**
   ```bash
   git status
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

2. **El workflow se ejecutará automáticamente**

3. **Monitorea el progreso en GitHub Actions**

4. **Verifica el deployment usando los pasos arriba**

---

**¡Listo para producción!** 🚀
