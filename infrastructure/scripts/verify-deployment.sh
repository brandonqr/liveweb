#!/bin/bash

# LiveWeb Deployment Verification Script

set -e

APP_NAME="liveweb"
APP_DIR="/opt/liveweb"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Verifying LiveWeb deployment...${NC}"

# Check PM2 status
echo "Checking PM2 status..."
pm2 status "$APP_NAME" || {
    echo -e "${RED}❌ Application not running in PM2${NC}"
    exit 1
}

# Check if process is running
if pm2 list | grep -q "$APP_NAME.*online"; then
    echo -e "${GREEN}✅ Application is running${NC}"
else
    echo -e "${RED}❌ Application is not online${NC}"
    exit 1
fi

# Get port from .env or use default
if [ -f "$APP_DIR/.env" ]; then
    export $(cat "$APP_DIR/.env" | grep -v '^#' | xargs)
fi
PORT=${PORT:-3001}

# Health check
echo "Checking backend health on port $PORT..."
if curl -f http://localhost:$PORT/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend health check passed${NC}"
else
    echo -e "${RED}❌ Backend health check failed${NC}"
    exit 1
fi

# Check API endpoint
echo "Checking API endpoint..."
if curl -f http://localhost:$PORT/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API endpoint is accessible${NC}"
else
    echo -e "${RED}❌ API endpoint check failed${NC}"
    exit 1
fi

# Check frontend files
if [ -d "$APP_DIR/frontend/dist" ] && [ "$(ls -A $APP_DIR/frontend/dist)" ]; then
    echo -e "${GREEN}✅ Frontend files exist${NC}"
else
    echo -e "${RED}❌ Frontend files not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All verification checks passed!${NC}"
