#!/bin/bash

# Script para ejecutar la configuración de SSL en el servidor
# Uso: ./ejecutar-ssl.sh

set -e

DOMAIN="liveweb.website"
SERVER_IP="93.93.116.136"
SERVER_USER="root"
APP_DIR="/opt/liveweb"

echo "🔒 Configurando SSL/HTTPS para ${DOMAIN}"
echo "=========================================="
echo ""

# Verificar que tenemos los datos necesarios
if [ -z "$SERVER_IP" ] || [ -z "$DOMAIN" ]; then
    echo "❌ Error: SERVER_IP y DOMAIN deben estar configurados"
    exit 1
fi

echo "📋 Configuración:"
echo "   Servidor: ${SERVER_USER}@${SERVER_IP}"
echo "   Dominio: ${DOMAIN}"
echo "   Directorio: ${APP_DIR}"
echo ""

# Verificar conectividad
echo "🔍 Verificando conectividad..."
if ! ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_IP} "echo 'OK'" 2>/dev/null; then
    echo "❌ No se puede conectar al servidor"
    echo ""
    echo "💡 Ejecuta manualmente:"
    echo "   ssh ${SERVER_USER}@${SERVER_IP}"
    echo "   cd ${APP_DIR}"
    echo "   sudo ./infrastructure/scripts/setup-ssl-domain.sh ${DOMAIN}"
    exit 1
fi

echo "✅ Conectividad OK"
echo ""

# Ejecutar script de SSL
echo "🚀 Ejecutando configuración de SSL..."
echo ""

ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_IP} << EOF
    set -e
    cd ${APP_DIR}
    
    echo "📝 Verificando que el script existe..."
    if [ ! -f "./infrastructure/scripts/setup-ssl-domain.sh" ]; then
        echo "❌ Script no encontrado en ${APP_DIR}/infrastructure/scripts/setup-ssl-domain.sh"
        exit 1
    fi
    
    echo "🔧 Ejecutando setup-ssl-domain.sh..."
    sudo ./infrastructure/scripts/setup-ssl-domain.sh ${DOMAIN}
    
    echo ""
    echo "✅ Configuración de SSL completada!"
    echo ""
    echo "🔍 Verificando..."
    curl -I https://${DOMAIN}/ || echo "⚠️  HTTPS aún no responde, puede tardar unos minutos"
EOF

echo ""
echo "✅ Proceso completado!"
echo ""
echo "🔍 Verifica que HTTPS funciona:"
echo "   curl -I https://${DOMAIN}/"
echo ""
echo "🌐 Abre en tu navegador:"
echo "   https://${DOMAIN}/"
echo ""
