#!/usr/bin/env bash
# Actualizar app en producción
# Uso: bash fresquitox/deploy/update.sh
set -euo pipefail

REPO_DIR="/var/www/Fresquitox"
APP_DIR="/var/www/Fresquitox/fresquitox"
BRANCH="${BRANCH:-juanaguilar}"

cd "$REPO_DIR"
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"

cd "$APP_DIR/frontend"
npm ci
npm run build

pm2 restart fresquitox
echo "Deploy actualizado."
