# LiveWeb Infrastructure

This directory contains deployment infrastructure files for LiveWeb.

## Structure

```
infrastructure/
├── nginx/
│   ├── nginx.conf          # Main Nginx configuration
│   ├── default.conf        # Default config for Docker Compose
│   └── liveweb.conf        # Production config for custom domain
└── scripts/
    ├── deploy.sh           # Main deployment script
    └── verify-deployment.sh # Deployment verification script
```

## Deployment Methods

### Option 1: PM2 (Recommended for Simple Deployment)

1. Copy files to server
2. Run deployment script:
   ```bash
   cd /opt/liveweb/infrastructure
   chmod +x scripts/*.sh
   ./scripts/deploy.sh
   ```

### Option 2: Docker Compose

1. Copy `docker-compose.yml` to server
2. Copy `.env` file
3. Run:
   ```bash
   docker-compose up -d
   ```

### Option 3: Nginx Reverse Proxy (For Custom Domain)

1. Install Nginx:
   ```bash
   sudo apt-get update
   sudo apt-get install nginx certbot python3-certbot-nginx
   ```

2. Copy Nginx config:
   ```bash
   sudo cp infrastructure/nginx/liveweb.conf /etc/nginx/sites-available/liveweb
   ```

3. Edit config with your domain:
   ```bash
   sudo nano /etc/nginx/sites-available/liveweb
   # Replace YOUR_DOMAIN.com with your actual domain
   ```

4. Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/liveweb /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

5. Get SSL certificate:
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

## Port Configuration

- **Backend**: Port 3001 (default, configurable via `PORT` env var or `APP_PORT` secret)
- **Frontend**: Port 80 (HTTP) or 443 (HTTPS) via Nginx

**Note:** Port 3000 is used by `latoxicatst-frontend` (Docker), so LiveWeb uses 3001 by default.

To avoid conflicts with other services:
- Change `PORT` in `.env` or set `APP_PORT` secret to use a different backend port
- Update Nginx config to proxy to the new port
- Update `API_BASE_URL` in frontend build

## Environment Variables

Required secrets in GitHub Actions:
- `SERVER_IP`: Server IP address
- `SERVER_USER`: SSH user (default: root)
- `SERVER_SSH_KEY` or `SERVER_PASSWORD`: SSH authentication
- `GEMINI_API_KEY`: Google Gemini API key
- `API_BASE_URL`: Backend API URL (optional, defaults to http://SERVER_IP:3001)
- `DOMAIN`: Custom domain (optional)

## Troubleshooting

### Port Conflicts

If port 3001 is also in use:
1. Change `PORT` in `.env`
2. Update PM2 or Docker config
3. Update Nginx upstream configuration

### PM2 Issues

```bash
# Check status
pm2 status

# View logs
pm2 logs liveweb

# Restart
pm2 restart liveweb

# Stop
pm2 stop liveweb
```

### Nginx Issues

```bash
# Test configuration
sudo nginx -t

# Reload
sudo systemctl reload nginx

# Check status
sudo systemctl status nginx
```
