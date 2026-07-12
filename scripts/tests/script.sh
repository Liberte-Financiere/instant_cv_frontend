#!/bin/bash
# ==============================================================================
# SCRIPT DE DÉPLOIEMENT ROUTINIER (Jobsira)
# Usage: ./deploy.sh
# ==============================================================================

# Arrêter le script si une erreur se produit
set -e

echo "========================================="
echo "🚀 DÉPLOIEMENT JOBSIRA DÉMARRÉ"
echo "========================================="

# 1. Nettoyage sécurisé
echo "🧹 Nettoyage de l'ancien build..."
# Un seul rm -rf suffit. S'il n'existe pas, il ne plantera pas.
rm -rf .next 

# 2. Mise à jour du code
echo "📦 1/6 - Récupération du code depuis GitHub..."
git pull origin dev

# 3. Installation des dépendances
echo "⚙️ 2/6 - Installation des modules Node.js..."
npm ci

# 4. Base de données
echo "🗄️ 3/6 - Mise à jour de Prisma (Base de données)..."
npx prisma generate
# Remplacé db push par migrate deploy pour éviter les pertes de données accidentelles
npx prisma migrate deploy 

# 5. Compilation (Build)
echo "🏗️ 4/6 - Build de l'application Next.js..."
npm run build

# 6. Préparation Standalone
echo "📁 5/6 - Copie des assets statiques..."
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/

# Copie du .env (le "|| true" empêche le script de planter si le fichier n'existe pas)
cp .env .next/standalone/ || true 

# 7. Redémarrage du serveur via PM2
echo "🔄 6/6 - Redémarrage du processus PM2..."
# pm2 start ecosystem.config.js mettra à jour si ça existe déjà, ou le créera.
# On évite le stop/delete manuel qui ferait planter le script avec 'set -e'
pm2 start ecosystem.config.js --update-env
pm2 save 

echo "========================================="
echo "✅ DÉPLOIEMENT TERMINÉ AVEC SUCCÈS !"
echo "========================================="