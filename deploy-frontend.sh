#!/bin/bash
# =============================================================================
# Frontend Auto Deploy Script
# Triggered by GitHub webhook on push to main.
# =============================================================================

set -euo pipefail

APP_DIR="/var/www/html/swiftearn-app"
NPM="/usr/bin/npm"

echo ""
echo "========================================="
echo " Frontend deploy started: $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo "========================================="

cd "$APP_DIR"

# 1. Backup .env before git reset (contains VITE_* build vars)
echo "[1/5] Backing up .env..."
cp -f .env /tmp/.env.swiftearn-web.bak 2>/dev/null || true

# 2. Pull latest code
echo "[2/5] git pull..."
git fetch origin main
git reset --hard origin/main

# 3. Restore .env (git reset --hard deletes it since it's gitignored)
echo "[3/5] Restoring .env..."
cp -f /tmp/.env.swiftearn-web.bak .env 2>/dev/null || true

# 4. Install dependencies and build
echo "[4/5] npm ci + build..."
$NPM ci --include=dev --prefer-offline --quiet
$NPM run build

# 5. Fix permissions (use current user, works on both test and production)
echo "[5/5] Fixing permissions..."
chown -R "$(whoami):$(whoami)" "$APP_DIR" 2>/dev/null || true

echo "-----------------------------------------"
echo " Frontend deploy finished: $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo "========================================="
