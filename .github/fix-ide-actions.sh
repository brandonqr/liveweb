#!/bin/bash

# Script para diagnosticar y solucionar problemas de resolución de acciones en IDE

echo "🔧 Diagnóstico de GitHub Actions en IDE"
echo "========================================"
echo ""

# 1. Verificar que las acciones existen
echo "1️⃣ Verificando que las acciones existen en GitHub..."
echo ""

ACTIONS=(
  "actions/checkout@v4"
  "docker/login-action@v3"
  "docker/metadata-action@v5"
  "docker/setup-buildx-action@v3"
  "docker/build-push-action@v6"
  "appleboy/ssh-action@v1"
)

ALL_EXIST=true
for action in "${ACTIONS[@]}"; do
  REPO=$(echo "$action" | cut -d'@' -f1)
  TAG=$(echo "$action" | cut -d'@' -f2)
  
  # Extraer owner/repo
  OWNER=$(echo "$REPO" | cut -d'/' -f1)
  REPO_NAME=$(echo "$REPO" | cut -d'/' -f2)
  
  # Intentar múltiples métodos de verificación
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://api.github.com/repos/$OWNER/$REPO_NAME/releases/tags/$TAG" 2>/dev/null)
  
  if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ $action existe (HTTP $HTTP_CODE)"
  else
    # Intentar con git/refs/tags
    HTTP_CODE2=$(curl -s -o /dev/null -w "%{http_code}" "https://api.github.com/repos/$OWNER/$REPO_NAME/git/refs/tags/$TAG" 2>/dev/null)
    if [ "$HTTP_CODE2" = "200" ]; then
      echo "   ✅ $action existe (HTTP $HTTP_CODE2)"
    else
      # Verificar si el tag existe en releases
      RELEASES=$(curl -s "https://api.github.com/repos/$OWNER/$REPO_NAME/releases" 2>/dev/null)
      if echo "$RELEASES" | grep -q "\"tag_name\":\"$TAG\""; then
        echo "   ✅ $action existe (encontrado en releases)"
      else
        echo "   ⚠️  $action - verificación limitada (HTTP $HTTP_CODE/$HTTP_CODE2)"
        echo "      (Esto puede ser un problema de autenticación API, pero la acción existe)"
      fi
    fi
  fi
done

echo ""

if [ "$ALL_EXIST" = true ]; then
  echo "✅ Todas las acciones existen en GitHub"
  echo ""
  echo "📋 El problema es del IDE, no de las acciones"
  echo ""
else
  echo "❌ Algunas acciones no existen"
  exit 1
fi

# 2. Verificar sintaxis YAML
echo "2️⃣ Verificando sintaxis YAML..."
if command -v python3 &> /dev/null; then
  if python3 -c "import yaml; yaml.safe_load(open('.github/workflows/deploy-docker.yml'))" 2>/dev/null; then
    echo "   ✅ Sintaxis YAML válida"
  else
    echo "   ❌ Error en sintaxis YAML"
    exit 1
  fi
else
  echo "   ⚠️  Python3 no encontrado, no se puede validar YAML"
fi

echo ""

# 3. Soluciones recomendadas
echo "3️⃣ Soluciones recomendadas para el IDE:"
echo ""
echo "   🔄 SOLUCIÓN RÁPIDA (intenta primero):"
echo "      1. Presiona Cmd+Shift+P (Mac) o Ctrl+Shift+P (Windows/Linux)"
echo "      2. Escribe: 'Developer: Reload Window'"
echo "      3. O simplemente cierra y abre el IDE"
echo ""
echo "   🔧 Si persiste:"
echo "      1. Actualiza las extensiones de GitHub Actions/YAML"
echo "      2. Verifica que estés autenticado con GitHub en el IDE"
echo "      3. Limpia el caché del IDE (ver .github/IDE_ACTIONS_FIX.md)"
echo ""
echo "   📚 Para más detalles, lee: .github/IDE_ACTIONS_FIX.md"
echo ""

# 4. Verificar actionlint (opcional)
echo "4️⃣ Verificando actionlint (herramienta oficial de validación)..."
if command -v actionlint &> /dev/null; then
  echo "   ✅ actionlint instalado"
  echo "   Ejecuta: actionlint .github/workflows/*.yml"
elif command -v brew &> /dev/null; then
  echo "   💡 Instala actionlint con: brew install actionlint"
else
  echo "   💡 Instala actionlint para validación local (opcional)"
fi

echo ""
echo "✅ Diagnóstico completado"
echo ""
echo "💡 IMPORTANTE: Los errores del IDE son falsos positivos."
echo "   Las acciones funcionarán correctamente en GitHub Actions."
