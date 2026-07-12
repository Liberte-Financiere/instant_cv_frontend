# ---------------------------------------------------------
# Étape 1 : BUILDER (Compilation et installation des paquets)
# ---------------------------------------------------------
# On utilise une version taggée précise (Debian 12 "Bookworm")
FROM python:3.11.9-slim-bookworm AS builder

# Éviter que Python crée des fichiers .pyc et forcer stdout non bufferisé
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /build

# Installation des paquets système nécessaires pour compiler/télécharger
RUN apt-get update && \
    apt-get install -y --no-install-recommends wget && \
    rm -rf /var/lib/apt/lists/*

# Création de l'environnement virtuel pour isoler les dépendances
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copie et installation des dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Pré-téléchargement du modèle IA U2Net pour le mettre en cache
# On le place dans un dossier spécifique qui sera copié
RUN mkdir -p /build/models && \
    wget -O /build/models/u2net.onnx https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net.onnx

# ---------------------------------------------------------
# Étape 2 : RUNNER (Image de production ultra-sécurisée)
# ---------------------------------------------------------
# Utilisation de la même version taggée, ou d'une image "distroless" python3-debian12
# Note: Google Distroless "pur" manque parfois de librairies C (comme libgomp pour ONNX).
# Utiliser slim-bookworm avec un utilisateur non-root offre la même surface d'attaque réduite tout en garantissant la compatibilité ML.
FROM python:3.11.9-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PATH="/opt/venv/bin:$PATH"

# Variable d'environnement pour indiquer à rembg où trouver le modèle
ENV U2NET_HOME="/app/models"

# Création d'un utilisateur système non-root (Sécurité)
# Aucun mot de passe, pas de répertoire home complexe, shell désactivé, UID fixe (1000)
RUN groupadd -g 1000 appgroup && useradd -u 1000 -r -s /bin/false -g appgroup appuser

WORKDIR /app

# On installe les libs systèmes vitales pour OpenCV et ONNXRuntime
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libglib2.0-0 \
        libgomp1 \
        libgl1 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copie de l'environnement virtuel pré-compilé (sans le cache pip, sans les outils de build)
COPY --from=builder /opt/venv /opt/venv

# Copie du modèle IA pré-téléchargé
COPY --from=builder /build/models /app/models

# Copie du code source
COPY main.py .

# On donne la propriété des fichiers à notre utilisateur non-root
RUN chown -R appuser:appgroup /app

# Switch vers l'utilisateur non-root pour l'exécution
USER appuser

# Le port d'écoute
EXPOSE 3001

# Healthcheck natif pour orchestration (Docker Compose / K8s)
# FastAPI ne gérant pas nativement curl s'il n'est pas installé, on utilise python -c avec urllib
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:3001/docs')" || exit 1

# Lancement sécurisé (pas de shell intermédiaire)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3001"]
