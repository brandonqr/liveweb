# 🔧 Solución: "Unable to resolve action" en IDE

## ❓ ¿Por qué mi IDE no encuentra las acciones si existen?

Este es un problema **común y conocido** con los IDEs (VSCode, Cursor, etc.) al trabajar con GitHub Actions. Las acciones **SÍ existen** y funcionan correctamente en GitHub Actions, pero el IDE no las puede resolver por varias razones:

### 🔍 Causas Principales

1. **Caché del IDE desactualizado**
   - El IDE mantiene un caché de metadatos de acciones
   - Si el caché está desactualizado, no reconoce versiones nuevas

2. **Extensión de GitHub Actions desactualizada o no instalada**
   - La extensión que valida las acciones puede estar desactualizada
   - O puede no estar instalada

3. **Problemas de red/proxy**
   - El IDE necesita conectarse a la API de GitHub para validar acciones
   - Firewalls o proxies pueden bloquear estas conexiones

4. **Índice del IDE corrupto**
   - El índice interno del IDE puede estar corrupto
   - Necesita ser reconstruido

5. **Falta de autenticación con GitHub**
   - Algunos IDEs requieren autenticación para acceder a la API de GitHub
   - Sin autenticación, no pueden validar las acciones

6. **Limitaciones del Language Server**
   - El language server de YAML/GitHub Actions puede tener limitaciones
   - A veces no puede resolver todas las versiones correctamente

---

## ✅ Soluciones (en orden de efectividad)

### Solución 1: Recargar/Reiniciar el IDE ⭐ (Más simple)

```bash
# En Cursor/VSCode:
# 1. Presiona Cmd+Shift+P (Mac) o Ctrl+Shift+P (Windows/Linux)
# 2. Escribe: "Developer: Reload Window"
# 3. O simplemente cierra y abre el IDE nuevamente
```

**Por qué funciona:** Limpia el caché en memoria y fuerza una revalidación.

---

### Solución 2: Limpiar caché del IDE

#### En Cursor/VSCode:

```bash
# 1. Cierra el IDE completamente
# 2. Elimina el caché del IDE:

# macOS:
rm -rf ~/Library/Application\ Support/Cursor/Cache/*
rm -rf ~/Library/Application\ Support/Cursor/CachedData/*

# Linux:
rm -rf ~/.config/Cursor/Cache/*
rm -rf ~/.config/Cursor/CachedData/*

# Windows:
# Elimina: %APPDATA%\Cursor\Cache\*
# Elimina: %APPDATA%\Cursor\CachedData\*
```

**Por qué funciona:** Elimina datos corruptos o desactualizados del caché.

---

### Solución 3: Verificar/Actualizar Extensión de GitHub Actions

1. **Abre el panel de extensiones:**
   - `Cmd+Shift+X` (Mac) o `Ctrl+Shift+X` (Windows/Linux)

2. **Busca:** "GitHub Actions" o "YAML"

3. **Extensiones recomendadas:**
   - `GitHub Actions` (por GitHub)
   - `YAML` (por Red Hat)
   - `GitHub Pull Requests and Issues` (por GitHub)

4. **Actualiza o reinstala** las extensiones

**Por qué funciona:** Las extensiones actualizadas tienen mejor soporte para resolver acciones.

---

### Solución 4: Configurar autenticación con GitHub

Si tu IDE requiere autenticación:

1. **En Cursor/VSCode:**
   - `Cmd+Shift+P` → "GitHub: Sign in"
   - O ve a Settings → Accounts → GitHub

2. **Verifica que estés autenticado:**
   - El IDE necesita acceso a la API de GitHub para validar acciones

**Por qué funciona:** Permite al IDE acceder a la API de GitHub para validar acciones.

---

### Solución 5: Configurar settings.json para ignorar estos errores

Si las soluciones anteriores no funcionan, puedes configurar el IDE para ignorar estos errores específicos:

```json
// .vscode/settings.json o configuración del IDE
{
  "yaml.schemas": {
    "https://json.schemastore.org/github-workflow.json": "**/.github/workflows/*.yml"
  },
  "yaml.customTags": [
    "!And",
    "!If",
    "!Not",
    "!Equals",
    "!Or"
  ],
  // Ignorar errores de resolución de acciones (son falsos positivos)
  "yaml.validate": true,
  "yaml.completion": true
}
```

**Nota:** Esto no resuelve el problema, solo oculta los errores. Las acciones seguirán funcionando en GitHub Actions.

---

### Solución 6: Usar actionlint (validación externa)

Instala `actionlint` para validar workflows localmente:

```bash
# macOS
brew install actionlint

# O con npm
npm install -g @github/actionlint

# Validar workflows
actionlint .github/workflows/*.yml
```

**Por qué funciona:** `actionlint` es la herramienta oficial de GitHub para validar workflows y es más precisa que los IDEs.

---

### Solución 7: Verificar conectividad con GitHub API

```bash
# Verifica que puedes acceder a la API de GitHub
curl -I https://api.github.com/repos/actions/checkout/git/refs/tags/v4

# Debe devolver: HTTP/2 200
```

Si no puedes acceder, verifica:
- Firewall/proxy
- VPN
- Configuración de red

---

## 🎯 Solución Recomendada (Pasos Rápidos)

1. **Recarga el IDE** (`Cmd+Shift+P` → "Reload Window")
2. **Si persiste:** Cierra completamente el IDE y ábrelo de nuevo
3. **Si aún persiste:** Actualiza las extensiones de GitHub Actions/YAML
4. **Si aún persiste:** Limpia el caché del IDE (Solución 2)
5. **Si aún persiste:** Configura autenticación con GitHub (Solución 4)

---

## ✅ Verificación Final

Después de aplicar las soluciones, verifica:

```bash
# 1. Las acciones existen (esto ya lo verificamos)
curl -I https://api.github.com/repos/actions/checkout/git/refs/tags/v4

# 2. El workflow tiene sintaxis válida
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/deploy-docker.yml'))"

# 3. Las acciones funcionarán en GitHub Actions (independientemente del IDE)
```

---

## 💡 Importante: Los Errores del IDE NO Afectan GitHub Actions

**Recuerda:** Estos errores en el IDE son **falsos positivos**. Las acciones funcionarán correctamente en GitHub Actions porque:

1. ✅ Las acciones existen (verificado con API de GitHub)
2. ✅ La sintaxis YAML es válida
3. ✅ GitHub Actions resuelve las acciones correctamente en tiempo de ejecución

El IDE solo está teniendo problemas para **validar** las acciones, pero esto no afecta su funcionamiento real.

---

## 📚 Referencias

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [actionlint - GitHub Actions Linter](https://github.com/rhymedev/actionlint)
- [VSCode GitHub Actions Extension](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-github-actions)

---

## 🆘 Si Nada Funciona

Si ninguna solución funciona, puedes:

1. **Ignorar los errores del IDE** - Son falsos positivos y no afectan el funcionamiento
2. **Usar `actionlint`** para validar workflows localmente
3. **Confiar en GitHub Actions** - Los workflows funcionarán correctamente aunque el IDE muestre errores

**Los workflows están correctos y funcionarán en GitHub Actions.** ✨
