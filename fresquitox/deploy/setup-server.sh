#!/usr/bin/env bash
# Setup inicial en Ubuntu (DigitalOcean Droplet)
# Uso: bash fresquitox/deploy/setup-server.sh  (desde la raíz del repo clonado)
set -euo pipefail

REPO_DIR="/var/www/Fresquitox"
APP_DIR="/var/www/Fresquitox/fresquitox"
REPO_URL="${REPO_URL:-https://github.com/Sticlo/Fresquitox.git}"
BRANCH="${BRANCH:-juanaguilar}"

echo "==> Instalando dependencias del sistema..."
sudo apt update
sudo apt install -y git nginx build-essential curl

if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
fi

if ! command -v pm2 >/dev/null 2>&1; then
  sudo npm install -g pm2
fi

echo "==> Clonando repo..."
sudo mkdir -p "$REPO_DIR"
sudo chown -R "$USER:$USER" "$REPO_DIR"

if [ ! -d "$REPO_DIR/.git" ]; then
  git clone --branch "$BRANCH" "$REPO_URL" "$REPO_DIR"
else
  cd "$REPO_DIR"
  git fetch origin
  git checkout "$BRANCH"
  git pull origin "$BRANCH"
fi

cd "$APP_DIR/frontend"

if [ ! -f src/environments/environment.secrets.ts ]; then
  cp src/environments/environment.secrets.example.ts src/environments/environment.secrets.ts
  echo ""
  echo "IMPORTANTE: edita $APP_DIR/frontend/src/environments/environment.secrets.ts"
  echo "y pega tu API key de DeepSeek antes de continuar."
  echo ""
  read -r -p "Presiona Enter cuando hayas guardado la key..."
fi

mkdir -p "$APP_DIR/data"

echo "==> Instalando npm y build..."
npm ci
npm run build

echo "==> Arrancando con PM2..."
pm2 delete fresquitox 2>/dev/null || true
pm2 start "$APP_DIR/deploy/ecosystem.config.cjs"
pm2 save
pm2 startup | tail -1 | bash || true

echo "==> Configurando Nginx..."
sudo cp "$APP_DIR/deploy/nginx-fresquitox.conf" /etc/nginx/sites-available/fresquitox
sudo ln -sf /etc/nginx/sites-available/fresquitox /etc/nginx/sites-enabled/fresquitox
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

echo "==> Firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo ""
echo "Listo. App corriendo en http://127.0.0.1:4000"
echo "Siguiente paso: apuntar fresquitox.com en Cloudflare a la IP de este servidor."
