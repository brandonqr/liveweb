# 🔑 Solución: Error 403 - API Key Leaked

## ❌ Error

```
POST http://localhost:8080/api/generate 403 (Forbidden)
Error: Access forbidden
"Your API key was reported as leaked. Please use another API key."
```

## 🔍 Causa

La `GEMINI_API_KEY` en tu archivo `.env` está marcada como **"leaked" (filtrada)** por Google. Esto puede pasar si:

1. La clave fue expuesta públicamente (GitHub, logs, etc.)
2. La clave fue compartida en algún lugar público
3. Google detectó uso anómalo de la clave

## ✅ Solución

### Paso 1: Obtener Nueva API Key

1. Ve a: **https://aistudio.google.com**
2. Inicia sesión con tu cuenta de Google
3. Ve a **"Get API Key"** o **"API Keys"**
4. Crea una **nueva API key**
5. **IMPORTANTE:** Usa una clave de **DESARROLLO/PRUEBAS**, no la de producción

### Paso 2: Actualizar `.env`

Edita el archivo `.env` en la raíz del proyecto:

```bash
# Editar .env
nano .env
# o
code .env
```

Reemplaza la línea:

```ini
GEMINI_API_KEY=tu_clave_antigua_aqui
```

Por:

```ini
GEMINI_API_KEY=tu_nueva_clave_aqui
```

### Paso 3: Reiniciar Contenedores

```bash
# Reiniciar solo el backend (más rápido)
docker compose restart liveweb-backend

# O reiniciar todo
docker compose restart
```

### Paso 4: Verificar

```bash
# Verificar que el backend está funcionando
curl http://localhost:8080/health

# Probar el endpoint de generate (debería funcionar ahora)
curl -X POST http://localhost:8080/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"test"}'
```

## 🛡️ Prevención

Para evitar que esto vuelva a pasar:

1. **Nunca commitees el archivo `.env`** (ya está en `.gitignore`)
2. **Usa claves diferentes** para desarrollo y producción
3. **No compartas claves** en chats, emails, o lugares públicos
4. **Rota las claves regularmente** si las usas en proyectos públicos

## 📝 Notas

- La clave que estaba en `.env.local.example` era solo un ejemplo
- Si esa clave se filtró, necesitas una nueva
- Google puede marcar claves como "leaked" automáticamente si detectan uso público

## 🔄 Si el Problema Persiste

Si después de cambiar la clave sigues teniendo problemas:

1. Verifica que la nueva clave esté correctamente configurada:
   ```bash
   docker compose exec liveweb-backend printenv GEMINI_API_KEY
   ```

2. Verifica los logs del backend:
   ```bash
   docker compose logs liveweb-backend | tail -20
   ```

3. Asegúrate de que la clave tenga los permisos correctos en Google AI Studio

---

**Última actualización:** $(date)
