#!/bin/bash

# Arrêter le script à la moindre erreur
set -e

echo "=========================================================="
echo "🚀 Déploiement du microservice Python (Background Removal)"
echo "=========================================================="

# 1. Vérification et installation de Docker
if ! command -v docker &> /dev/null; then
    echo "🐳 Docker n'est pas installé. Installation en cours (nécessite sudo)..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    rm get-docker.sh
    echo "✅ Docker a été installé avec succès."
else
    echo "✅ Docker est déjà installé sur ce système."
fi

# 2. Navigation vers le répertoire du microservice
# On s'assure qu'on est bien à la racine du projet frontend/instant_cv avant de descendre
if [ ! -d "microservices/bg_removal" ]; then
    echo "❌ Erreur : Le dossier 'microservices/bg_removal' est introuvable."
    echo "Assurez-vous de lancer ce script depuis la racine du projet (frontend/instant_cv)."
    exit 1
fi

cd microservices/bg_removal

# 3. Build de l'image Docker
echo "🔨 Construction de l'image Docker 'jobsira-python-bg' (cela peut prendre quelques minutes lors du premier lancement pour télécharger le modèle IA)..."
sudo docker build -t jobsira-python-bg .

# 4. Arrêt et suppression de l'ancien conteneur (s'il existe)
echo "🛑 Nettoyage de l'ancien conteneur..."
if sudo docker ps -a --format '{{.Names}}' | grep -Eq "^bg-remover\$"; then
    sudo docker stop bg-remover
    sudo docker rm bg-remover
    echo "Ancien conteneur supprimé."
fi

# 5. Lancement du nouveau conteneur
echo "🚀 Lancement du nouveau conteneur (Binding sécurisé sur localhost:3001)..."
sudo docker run -d -p 127.0.0.1:3001:3001 --name bg-remover --restart always jobsira-python-bg

echo "=========================================================="
echo "✅ DÉPLOIEMENT TERMINÉ AVEC SUCCÈS !"
echo "=========================================================="
echo "Le microservice tourne en tâche de fond."
echo "Pour voir les logs en direct, tapez : sudo docker logs -f bg-remover"
