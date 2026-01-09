#!/bin/bash

# Setup SSL/HTTPS for LiveWeb with custom domain
# This script configures nginx on the HOST (not in Docker) to proxy to Docker containers
# Usage: ./setup-ssl-domain.sh yourdomain.com

set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <domain>"
    echo "Example: $0 liveweb.example.com"
    exit 1
fi

DOMAIN=$1
APP_DIR="/opt/liveweb"
NGINX_SITES_AVAILABLE="/etc/nginx/sites-available"
NGINX_SITES_ENABLED="/etc/nginx/sites-enabled"

echo "🔒 Setting up SSL/HTTPS for domain: $DOMAIN"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

# Install Nginx if not installed
if ! command -v nginx &> /dev/null; then
    echo "📦 Installing Nginx..."
    apt-get update -qq
    apt-get install -y -qq nginx
fi

# Install Certbot if not installed
if ! command -v certbot &> /dev/null; then
    echo "📦 Installing Certbot..."
    apt-get update -qq
    apt-get install -y -qq certbot python3-certbot-nginx
fi

# Create directory for Let's Encrypt challenge
mkdir -p /var/www/certbot

# Check if nginx config already exists (from setup-nginx-proxy.sh)
if [ -f "$NGINX_SITES_AVAILABLE/liveweb" ]; then
    echo "✅ Nginx configuration already exists, using it..."
    echo "   Certbot will automatically modify it to add SSL"
    
    # Verify the config is valid (HTTP only, before SSL)
    echo "🧪 Testing existing Nginx configuration..."
    nginx -t || {
        echo "⚠️  Existing config has issues, but continuing with certbot..."
    }
else
    # If config doesn't exist, create a basic HTTP-only config for Let's Encrypt
    echo "📝 Creating basic HTTP-only Nginx configuration for Let's Encrypt..."
    cat > "$NGINX_SITES_AVAILABLE/liveweb" << NGINXEOF
upstream liveweb_backend {
    server 127.0.0.1:3001;
    keepalive 32;
}

server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN};
    
    # Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    # IMPORTANTE: Permitir uploads de archivos grandes
    client_max_body_size 10M;
    
    # Proxy ALL requests to Docker container
    location / {
        proxy_pass http://liveweb_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # SSE support
        proxy_buffering off;
        proxy_read_timeout 86400;
    }
}
NGINXEOF
    
    # Create symlink
    if [ -L "$NGINX_SITES_ENABLED/liveweb" ]; then
        rm "$NGINX_SITES_ENABLED/liveweb"
    fi
    ln -s "$NGINX_SITES_AVAILABLE/liveweb" "$NGINX_SITES_ENABLED/liveweb"
    
    # Remove default nginx site if it exists
    if [ -L "$NGINX_SITES_ENABLED/default" ]; then
        rm "$NGINX_SITES_ENABLED/default"
    fi
    
    # Test Nginx configuration
    echo "🧪 Testing Nginx configuration..."
    nginx -t || {
        echo "❌ Nginx configuration test failed!"
        exit 1
    }
    
    # Reload Nginx
    echo "🔄 Reloading Nginx..."
    systemctl reload nginx
fi

# Get SSL certificate with Certbot
echo "🔐 Obtaining SSL certificate from Let's Encrypt..."
echo "⚠️  Make sure your domain DNS points to this server before continuing!"

# Only prompt for input if running interactively (has TTY)
if [ -t 0 ]; then
    read -p "Press Enter to continue or Ctrl+C to cancel..."
fi

certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email admin@"$DOMAIN" || {
    echo "⚠️  Certbot failed. This might be because:"
    echo "   1. DNS is not pointing to this server yet"
    echo "   2. Port 80 is not accessible from the internet"
    echo "   3. Domain is already configured"
    echo ""
    echo "You can try again later with:"
    echo "   sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
    exit 1
}

# Reload Nginx again after certbot
systemctl reload nginx

echo ""
echo "✅ SSL/HTTPS setup completed!"
echo ""
echo "🌐 Your application is now available at:"
echo "   - https://$DOMAIN"
echo "   - https://www.$DOMAIN"
echo ""
echo "📝 Notes:"
echo "   - HTTP requests are automatically redirected to HTTPS"
echo "   - SSL certificate will auto-renew via certbot"
echo "   - Nginx on the host proxies to Docker container on port 3001"
echo ""
echo "🔍 Verify SSL:"
echo "   curl -I https://$DOMAIN"
