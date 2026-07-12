#!/bin/bash
# ==============================================================================
# SCRIPT DE DEPLOIEMENT SIMPLIFIE (Jobsira)
# Pre-requis : le build est fait en CI (branche "build")
# Usage: ./deploy.sh
# ==============================================================================
set -euo pipefail

APP_DIR="$HOME/jobsira"
ENV_FILE="$HOME/.env.jobsira"

echo "========================================="
echo "DEPLOIEMENT JOBSIRA"
echo "========================================="

# 1. Premier deploiement : cloner la branche build
if [[ ! -d "$APP_DIR/.git" ]]; then
  echo "[1/3] Premier deploiement - clonage de la branche build..."
  git clone --branch build --single-branch --depth 1 \
    https://github.com/Liberte-Financiere/instant_cv_frontend.git "$APP_DIR"
else
  echo "[1/3] Recuperation du dernier build..."
  cd "$APP_DIR"
  git fetch origin build
  git reset --hard origin/build
fi

cd "$APP_DIR"

# 2. Copier les variables d'environnement
echo "[2/3] Configuration de l'environnement..."
if [[ -f "$ENV_FILE" ]]; then
  cp "$ENV_FILE" .env
else
  echo "ATTENTION : fichier $ENV_FILE introuvable."
  echo "Creez-le avec vos variables d'environnement avant le premier deploiement."
  exit 1
fi

# 3. Redemarrage PM2
echo "[3/3] Redemarrage de l'application..."
pm2 stop jobsira 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

echo "========================================="
echo "DEPLOIEMENT TERMINE"
echo "========================================="
pm2 status
