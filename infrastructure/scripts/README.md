# Deployment Scripts

## deploy.sh

Main deployment script that:
- Installs/updates dependencies
- Stops existing PM2 process
- Starts application with PM2
- Performs health checks
- Sets up PM2 startup script

**Usage:**
```bash
cd /opt/liveweb/infrastructure
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

## verify-deployment.sh

Verification script that checks:
- PM2 process status
- Backend health endpoint
- API endpoint accessibility
- Frontend files existence

**Usage:**
```bash
cd /opt/liveweb/infrastructure
chmod +x scripts/verify-deployment.sh
./scripts/verify-deployment.sh
```

## setup-nginx.sh

Sets up Nginx configuration for custom domain.

**Usage:**
```bash
sudo ./infrastructure/scripts/setup-nginx.sh yourdomain.com
```

**Requirements:**
- Must run as root (use sudo)
- Domain DNS must point to server
- Nginx must be installed
