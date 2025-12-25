#!/bin/bash

# ============================================
# LiveWeb - Quick Start Script for GitHub
# ============================================
# Este script te ayuda a verificar y subir
# el proyecto a GitHub de forma segura.
# ============================================

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# ============================================
# 1. Verificaciones de Seguridad
# ============================================

print_header "1. VERIFICACIONES DE SEGURIDAD"

# Check if .env is in .gitignore
print_info "Verificando que .env esté en .gitignore..."
if grep -q "^\.env$" .gitignore; then
    print_success ".env está en .gitignore"
else
    print_error ".env NO está en .gitignore"
    exit 1
fi

# Check if .env exists but is not tracked
print_info "Verificando que .env no esté en el repositorio..."
if git ls-files | grep -q "^\.env$"; then
    print_error ".env está siendo trackeado por Git!"
    print_warning "Ejecuta: git rm --cached .env"
    exit 1
else
    print_success ".env no está en el repositorio"
fi

# Check if node_modules is ignored
print_info "Verificando que node_modules no esté en el repositorio..."
if git ls-files | grep -q "node_modules/"; then
    print_error "node_modules está siendo trackeado por Git!"
    print_warning "Ejecuta: git rm -r --cached node_modules/"
    exit 1
else
    print_success "node_modules no está en el repositorio"
fi

# Check for API keys in code
print_info "Buscando API keys hardcodeadas..."
if git grep -i "AIza" -- '*.js' '*.jsx' '*.ts' '*.tsx' 2>/dev/null | grep -v ".env.example"; then
    print_error "Se encontraron posibles API keys en el código!"
    exit 1
else
    print_success "No se encontraron API keys hardcodeadas"
fi

# ============================================
# 2. Verificaciones de Archivos
# ============================================

print_header "2. VERIFICACIONES DE ARCHIVOS"

# Check required files
required_files=("README.md" "LICENSE" "CONTRIBUTING.md" ".gitignore" ".env.example" "package.json")

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "$file existe"
    else
        print_error "$file NO existe"
        exit 1
    fi
done

# ============================================
# 3. Verificaciones de Dependencias
# ============================================

print_header "3. VERIFICACIONES DE DEPENDENCIAS"

# Check if node_modules exists
if [ -d "node_modules" ]; then
    print_success "node_modules existe (backend)"
else
    print_warning "node_modules no existe (backend)"
    print_info "Ejecutando: npm install"
    npm install
fi

# Check frontend node_modules
if [ -d "frontend/node_modules" ]; then
    print_success "node_modules existe (frontend)"
else
    print_warning "node_modules no existe (frontend)"
    print_info "Ejecutando: cd frontend && npm install"
    cd frontend && npm install && cd ..
fi

# ============================================
# 4. Verificación de Configuración
# ============================================

print_header "4. VERIFICACIÓN DE CONFIGURACIÓN"

# Check if .env exists
if [ -f ".env" ]; then
    print_success ".env existe"
    
    # Check if GEMINI_API_KEY is set
    if grep -q "GEMINI_API_KEY=your_gemini_api_key_here" .env; then
        print_warning ".env contiene el placeholder. Asegúrate de agregar tu API key real."
    elif grep -q "GEMINI_API_KEY=" .env; then
        print_success "GEMINI_API_KEY está configurado"
    else
        print_error "GEMINI_API_KEY no está en .env"
        exit 1
    fi
else
    print_warning ".env no existe"
    print_info "Copiando .env.example a .env"
    cp .env.example .env
    print_warning "Por favor, edita .env y agrega tu GEMINI_API_KEY"
    exit 1
fi

# ============================================
# 5. Git Status
# ============================================

print_header "5. ESTADO DE GIT"

# Check if git is initialized
if [ -d ".git" ]; then
    print_success "Repositorio Git inicializado"
else
    print_warning "Git no está inicializado"
    print_info "¿Deseas inicializar Git? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        git init
        print_success "Git inicializado"
    else
        print_error "Git no inicializado. Saliendo..."
        exit 1
    fi
fi

# Show git status
print_info "Estado de Git:"
git status --short

# ============================================
# 6. Resumen
# ============================================

print_header "6. RESUMEN"

print_success "Todas las verificaciones pasaron correctamente!"
echo ""
print_info "Archivos listos para commit:"
git status --short
echo ""

# ============================================
# 7. Opciones de Acción
# ============================================

print_header "7. ¿QUÉ DESEAS HACER?"

echo "1) Ver qué archivos se van a commitear"
echo "2) Hacer commit inicial"
echo "3) Configurar remote de GitHub"
echo "4) Push a GitHub"
echo "5) Todo lo anterior (commit + remote + push)"
echo "6) Salir"
echo ""
read -p "Selecciona una opción (1-6): " option

case $option in
    1)
        print_info "Archivos que se van a commitear:"
        git status
        ;;
    2)
        print_info "Haciendo commit inicial..."
        git add .
        git commit -m "feat: initial commit - LiveWeb v1.0.0

- AI-powered web builder using voice commands
- Google Gemini 3 Flash integration
- Real-time code generation
- Template system
- Checkpoint management
- Multi-language support (EN/ES)
- Complete documentation"
        print_success "Commit realizado"
        ;;
    3)
        read -p "Ingresa la URL de tu repositorio GitHub (ej: https://github.com/usuario/liveweb.git): " repo_url
        git remote add origin "$repo_url"
        print_success "Remote configurado: $repo_url"
        git remote -v
        ;;
    4)
        print_info "Haciendo push a GitHub..."
        git branch -M main
        git push -u origin main
        print_success "Push completado"
        ;;
    5)
        print_info "Ejecutando proceso completo..."
        
        # Commit
        print_info "1/3 - Haciendo commit..."
        git add .
        git commit -m "feat: initial commit - LiveWeb v1.0.0

- AI-powered web builder using voice commands
- Google Gemini 3 Flash integration
- Real-time code generation
- Template system
- Checkpoint management
- Multi-language support (EN/ES)
- Complete documentation"
        print_success "Commit realizado"
        
        # Remote
        read -p "Ingresa la URL de tu repositorio GitHub (ej: https://github.com/usuario/liveweb.git): " repo_url
        git remote add origin "$repo_url"
        print_success "Remote configurado: $repo_url"
        
        # Push
        print_info "3/3 - Haciendo push a GitHub..."
        git branch -M main
        git push -u origin main
        print_success "Push completado"
        
        print_success "¡Proceso completado! Tu proyecto está en GitHub."
        ;;
    6)
        print_info "Saliendo..."
        exit 0
        ;;
    *)
        print_error "Opción inválida"
        exit 1
        ;;
esac

# ============================================
# 8. Próximos Pasos
# ============================================

print_header "8. PRÓXIMOS PASOS"

echo "✅ Tu proyecto está listo para GitHub"
echo ""
echo "Próximos pasos recomendados:"
echo "1. Ve a tu repositorio en GitHub"
echo "2. Configura la sección 'About' con descripción y topics"
echo "3. Habilita Issues y Discussions"
echo "4. Crea una release v1.0.0"
echo "5. Agrega screenshots al README"
echo "6. Comparte tu proyecto con la comunidad"
echo ""
echo "Para más información, consulta:"
echo "- GITHUB_CHECKLIST.md"
echo "- PREPARATION_SUMMARY.md"
echo ""

print_success "¡Felicidades! 🎉"

