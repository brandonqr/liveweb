#!/bin/bash

# Setup Nginx for LiveWeb with custom domain
# Usage: ./setup-nginx.sh yourdomain.com

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

echo "Setting up Nginx for domain: $DOMAIN"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root (use sudo)"
    exit 1
fi

# Install Nginx if not installed
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    apt-get update
    apt-get install -y nginx
fi

# Copy and customize Nginx config
echo "Creating Nginx configuration..."
sed "s/YOUR_DOMAIN.com/$DOMAIN/g" "$APP_DIR/infrastructure/nginx/liveweb.conf" > "$NGINX_SITES_AVAILABLE/liveweb"

# Create symlink
if [ -L "$NGINX_SITES_ENABLED/liveweb" ]; then
    rm "$NGINX_SITES_ENABLED/liveweb"
fi
ln -s "$NGINX_SITES_AVAILABLE/liveweb" "$NGINX_SITES_ENABLED/liveweb"

# Test Nginx configuration
echo "Testing Nginx configuration..."
nginx -t || {
    echo "Nginx configuration test failed!"
    exit 1
}

# Reload Nginx
echo "Reloading Nginx..."
systemctl reload nginx

echo "✅ Nginx setup completed!"
echo "Next steps:"
echo "1. Update DNS records to point $DOMAIN to this server"
echo "2. Run: sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo "3. Update SSL certificate paths in $NGINX_SITES_AVAILABLE/liveweb if needed"
