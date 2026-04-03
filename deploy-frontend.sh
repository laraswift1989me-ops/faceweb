#!/bin/bash
# =============================================================================
# SwiftEarn — Frontend Auto Deploy Script
# Triggered by GitHub webhook on push to main.
# =============================================================================

set -euo pipefail

APP_DIR="/var/www/html/swiftearn-app"
NODE="/usr/bin/node"
NPM="/usr/bin/npm"

echo ""
echo "========================================="
echo " Frontend deploy started: $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo "========================================="

cd "$APP_DIR"

# 1. Pull latest code
echo "[1/4] git pull..."
git pull origin main

# 2. Install dependencies including devDependencies (vite, etc. are needed for build)
echo "[2/4] npm ci..."
$NPM ci --include=dev --prefer-offline --quiet

# 3. Build for production
echo "[3/4] npm run build..."
$NPM run build

# 4. Fix permissions on dist/
echo "[4/4] Fixing permissions..."
chown -R www-data:www-data "$APP_DIR/dist" 2>/dev/null || true

echo "-----------------------------------------"
echo " Frontend deploy finished: $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo "========================================="
