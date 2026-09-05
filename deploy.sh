#!/bin/bash
#
# Sun Valley Weather — Railway deploy script
# Deploys this folder (the new heritage-alpine weather mockup) to your existing
# Railway service, preserving your live URL:
#   https://web-production-51403.up.railway.app
#
# What it does:
#   1. Downloads the Railway CLI (macOS arm64) if not already installed.
#   2. Logs you in via browser (Railway OAuth).
#   3. Links this folder to your "Sun Valley Weather" project → web service → production.
#   4. Uploads and deploys.
#
# Run from anywhere:   bash deploy.sh
set -e

cd "$(dirname "$0")"

# --- Config (from your Railway account) ---------------------------------------
PROJECT_ID="95d06b42-6dd8-437a-9bd5-649228106c04"   # Sun Valley Weather
SERVICE_ID="d2c438d5-9775-4049-ac3a-d9dbe3ebae31"  # web
ENV_ID="c824e965-9059-489c-94dc-b147e32d4e3b"      # production
RAILWAY_VER="5.49.2"
TRIPLE="aarch64-apple-darwin"
RAILWAY_BIN="$HOME/.railway/bin/railway"

# --- 1. Ensure Railway CLI -----------------------------------------------------
if [ ! -x "$RAILWAY_BIN" ]; then
  echo "==> Downloading Railway CLI v${RAILWAY_VER} (${TRIPLE})..."
  mkdir -p "$(dirname "$RAILWAY_BIN")"
  URL="https://github.com/railwayapp/cli/releases/download/v${RAILWAY_VER}/railway-v${RAILWAY_VER}-${TRIPLE}.tar.gz"
  curl -fsSL "$URL" -o /tmp/railway.tar.gz
  mkdir -p /tmp/railway-extract
  tar -xzf /tmp/railway.tar.gz -C /tmp/railway-extract
  mv /tmp/railway-extract/railway "$RAILWAY_BIN"
  chmod +x "$RAILWAY_BIN"
  rm -rf /tmp/railway.tar.gz /tmp/railway-extract
fi

echo "==> Railway CLI ready: $("$RAILWAY_BIN" --version 2>/dev/null || echo 'installed')"

# --- 2. Login -----------------------------------------------------------------
echo ""
echo "==> Logging in to Railway (a browser window will open)..."
"$RAILWAY_BIN" login

# --- 3. Link this folder to the project/service/environment --------------------
echo ""
echo "==> Linking to Sun Valley Weather → web → production..."
"$RAILWAY_BIN" link -p "$PROJECT_ID" -e "$ENV_ID" -s "$SERVICE_ID" || "$RAILWAY_BIN" link

# --- 4. Deploy ----------------------------------------------------------------
echo ""
echo "==> Uploading & deploying to Railway..."
"$RAILWAY_BIN" up

echo ""
echo "==> Deploy submitted."
echo "    Watch the build: https://railway.com/dashboard"
echo "    Live URL:        https://web-production-51403.up.railway.app"
echo "    (It may take 1–2 min for the build to finish and the new site to go live.)"
