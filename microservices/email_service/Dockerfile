FROM python:3.11-slim

WORKDIR /app

# Installer curl pour le healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Variables d'environnement par défaut
ENV PORT=3002
ENV INTERNAL_API_KEY="to_be_configured_in_production"
# BREVO_API_KEY doit être passé à l'exécution

EXPOSE 3002

# Healthcheck natif Docker (ping la route /health qu'on a codée)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl --fail http://localhost:3002/health || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3002"]
