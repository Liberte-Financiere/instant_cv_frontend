#!/bin/bash

# Arrêter le script si une commande échoue
set -e

echo "🚀 Préparation du test de charge Jobsira..."

# 1. Générer le cookie étudiant (et s'assurer qu'il est en base)
echo "⏳ Synchronisation de l'étudiant fantôme..."
STUDENT_OUTPUT=$(npx tsx scripts/generate-test-cookie.ts --prod --email "loadtest-student@ecole.fr" --with-school --schoolId "ecole-test-k6")
STUDENT_COOKIE=$(echo "$STUDENT_OUTPUT" | grep "__Secure-authjs.session-token=")

if [ -z "$STUDENT_COOKIE" ]; then
  echo "❌ Erreur: Impossible de générer le cookie étudiant."
  exit 1
fi

# 2. Générer le cookie admin
echo "⏳ Synchronisation de l'admin fantôme..."
ADMIN_OUTPUT=$(npx tsx scripts/generate-test-cookie.ts --prod --school --email "loadtest-admin@ecole.fr" --schoolId "ecole-test-k6")
ADMIN_COOKIE=$(echo "$ADMIN_OUTPUT" | grep "__Secure-authjs.session-token=")

if [ -z "$ADMIN_COOKIE" ]; then
  echo "❌ Erreur: Impossible de générer le cookie admin."
  exit 1
fi

# 3. Lancer le test K6
echo "🔥 Lancement du test K6 sur la production (https://jobsira.com)..."
k6 run \
  -e TARGET_URL="https://jobsira.com" \
  -e ADMIN_COOKIE="$ADMIN_COOKIE" \
  -e STUDENT_COOKIE="$STUDENT_COOKIE" \
  scripts/tests/load_test_school.js

echo "✅ Test terminé ! Ouvre le fichier summary.html dans ton navigateur pour voir les résultats graphiques."
