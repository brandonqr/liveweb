#!/bin/bash
# Commit script for LiveWeb - Initial Setup

echo "🚀 Starting commit process..."

# 1. Infrastructure and Configuration
echo "📦 Committing infrastructure files..."
git add Dockerfile docker-compose.yml
git add infrastructure/
git commit -m "feat: add deployment infrastructure with Docker and PM2 support" || true

# 2. Port Configuration
echo "🔌 Committing port configuration..."
git add server/config/index.js
git add .env.example
git commit -m "config: change default port from 3000 to 3001 to avoid conflicts" || true

# 3. CI/CD Workflows
echo "⚙️ Committing CI/CD workflows..."
git add .github/workflows/
git commit -m "ci: add GitHub Actions workflows for automated deployment" || true

# 4. Server Updates
echo "🖥️ Committing server configuration..."
git add server/app.js server/middleware/cors.js
git commit -m "feat: add production static file serving and CORS configuration" || true

# 5. Frontend Build Configuration
echo "🎨 Committing frontend build configuration..."
git add frontend/vite.config.js frontend/src/services/api.js
git commit -m "config: update frontend build for production deployment" || true

# 6. Documentation
echo "📚 Committing documentation..."
git add README.md DEPLOYMENT.md DEPLOYMENT_SETUP.md PORT_CONFIGURATION.md
git add .github/SECRETS_SETUP.md .github/COMMIT_GUIDE.md
git add infrastructure/README.md
git commit -m "docs: add comprehensive deployment and setup documentation" || true

# 7. Final cleanup
echo "🧹 Final cleanup..."
git add .
git status --short

echo "✅ Commit process complete!"
echo ""
echo "📋 Summary:"
git log --oneline -10
