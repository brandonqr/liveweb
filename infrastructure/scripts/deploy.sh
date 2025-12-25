#!/bin/bash

# LiveWeb Deployment Script
# This script handles the deployment of LiveWeb to production

set -e

APP_NAME="liveweb"
APP_DIR="/opt/liveweb"
LOG_DIR="$APP_DIR/logs"
LOG_FILE="$LOG_DIR/deploy.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Create log directory if it doesn't exist
mkdir -p "$LOG_DIR"

log "Starting LiveWeb deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    error "Node.js is not installed. Please install Node.js 22+ first."
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    log "PM2 not found, installing..."
    npm install -g pm2 || error "Failed to install PM2"
fi

# Navigate to app directory
cd "$APP_DIR" || error "Failed to navigate to $APP_DIR"

# Load environment variables
if [ -f .env ]; then
    log "Loading environment variables from .env"
    export $(cat .env | grep -v '^#' | xargs)
else
    warning ".env file not found, using system environment variables"
fi

# Install/update dependencies
log "Installing dependencies..."
npm install --production || error "Failed to install dependencies"

# Stop existing application if running
log "Stopping existing application..."
pm2 stop "$APP_NAME" 2>/dev/null || warning "Application not running"
pm2 delete "$APP_NAME" 2>/dev/null || warning "Application not found in PM2"

# Start application with PM2
log "Starting application with PM2..."
pm2 start server.js \
    --name "$APP_NAME" \
    --update-env \
    --log "$LOG_DIR/app.log" \
    --error "$LOG_DIR/error.log" \
    --out "$LOG_DIR/out.log" \
    --time \
    --restart-delay 3000 \
    --max-restarts 10 \
    --min-uptime 10000 \
    || error "Failed to start application"

# Save PM2 configuration
pm2 save || warning "Failed to save PM2 configuration"

# Setup PM2 startup script
log "Setting up PM2 startup script..."
pm2 startup systemd -u "$USER" --hp "$HOME" || warning "Failed to setup PM2 startup (may need sudo)"

# Wait for application to start
log "Waiting for application to start..."
sleep 5

# Get port from .env or use default
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi
PORT=${PORT:-3001}

# Health check
log "Performing health check on port $PORT..."
MAX_RETRIES=10
RETRY_DELAY=2

for i in $(seq 1 $MAX_RETRIES); do
    if curl -f http://localhost:$PORT/health > /dev/null 2>&1; then
        log "✅ Health check passed!"
        break
    else
        if [ $i -eq $MAX_RETRIES ]; then
            error "Health check failed after $MAX_RETRIES attempts"
        fi
        log "Health check attempt $i/$MAX_RETRIES failed, retrying..."
        sleep $RETRY_DELAY
    fi
done

# Show application status
log "Application status:"
pm2 status "$APP_NAME"

log "✅ Deployment completed successfully!"
log "Application is running on port $PORT"
log "Logs are available in $LOG_DIR/"
