# 🐍 Guide de Déploiement : Microservice Python (Background Removal)

Ce projet inclut un microservice Python développé avec **FastAPI** et **rembg**. Son rôle est de supprimer l'arrière-plan des photos de profil uploadées par les utilisateurs.

Il fonctionne de manière indépendante de l'application Next.js (Node.js) et écoute par défaut sur le port `3001`.

---

## 🏗️ 1. Prérequis Serveur

Pour exécuter ce microservice sur votre serveur de production (VPS, Dédié, etc.), vous avez besoin de :
- **Python 3.9+** (Recommandé : 3.10 ou 3.11)
- `pip` et `venv` (pour l'environnement virtuel)
- Si vous êtes sur un serveur Linux propre (ex: Ubuntu), installez les dépendances système requises pour le traitement d'images :
  ```bash
  sudo apt update
  sudo apt install python3-pip python3-venv libgl1 libglib2.0-0
  ```

---

## 🚀 2. Déploiement "Bare Metal" (Recommandé si vous avez déjà Node/PM2)

Si vous déployez directement sur le serveur sans Docker, vous pouvez utiliser **PM2** (que vous utilisez probablement déjà pour l'application Next.js) pour gérer le processus Python.

### Étape A : Installation locale
Connectez-vous à votre serveur et allez dans le dossier du microservice :
```bash
cd /chemin/vers/votre/projet/microservices/bg_removal
```

Créez et activez l'environnement virtuel Python :
```bash
python3 -m venv venv
source venv/bin/activate
```

Installez les dépendances :
```bash
pip install -r requirements.txt
```

> [!WARNING]
> **Pré-téléchargement du Modèle IA :**
> Lors de sa première exécution, `rembg` télécharge un modèle de ~170Mo (`u2net.onnx`). Si un utilisateur fait une requête à ce moment-là, elle tombera en timeout.
> **Solution :** Lancez l'API une première fois manuellement, ou téléchargez le modèle via la CLI rembg :
> `rembg i input_test.jpg output_test.png` (Ceci forcera le téléchargement dans `~/.u2net/`).

### Étape B : Lancement avec PM2

Créez un fichier `ecosystem.config.js` à la racine de votre projet (si vous n'en avez pas déjà un), ou lancez simplement le script via PM2 avec l'interpréteur de l'environnement virtuel :

```bash
# S'assurer d'être dans le bon dossier
cd /chemin/vers/votre/projet/microservices/bg_removal

# Démarrer FastAPI avec uvicorn via PM2 en utilisant le binaire Python du venv
pm2 start ./venv/bin/uvicorn --name "jobsira-python-bg" --interpreter ./venv/bin/python -- main:app --host 0.0.0.0 --port 3001
```

Sauvegardez l'état de PM2 pour qu'il redémarre au reboot du serveur :
```bash
pm2 save
pm2 startup
```

---

## 🐳 3. Déploiement via Docker (Alternative très robuste)

Docker est idéal pour les applications IA en Python car il isole parfaitement les dépendances complexes (comme OnnxRuntime).

Créez un fichier `Dockerfile` dans le dossier `microservices/bg_removal` :

```dockerfile
# microservices/bg_removal/Dockerfile
FROM python:3.11-slim

# Dépendances système pour OpenCV / rembg
RUN apt-get update && apt-get install -y libgl1 libglib2.0-0 wget && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copie des fichiers
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pré-téléchargement du modèle IA (évite le délai au 1er lancement)
RUN mkdir -p /root/.u2net && \
    wget -O /root/.u2net/u2net.onnx https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net.onnx

COPY main.py .

EXPOSE 3001

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3001"]
```

Puis lancez le conteneur sur le serveur :
```bash
cd microservices/bg_removal
docker build -t jobsira-python-bg .
docker run -d -p 3001:3001 --name bg-remover --restart always jobsira-python-bg
```

---

## 🔗 4. Connecter Next.js à ce Microservice

L'application Next.js (JobSira) s'attend à ce que le microservice soit disponible sur `http://localhost:3001/remove-bg`.

Assurez-vous que l'URL est bien configurée dans votre fichier `.env` côté Next.js (ou directement dans le code d'appel), par exemple :
```env
PYTHON_MICROSERVICE_URL=http://localhost:3001
```

*Note : Si le backend Node.js et ce microservice Python tournent sur le même serveur, le port 3001 n'a pas besoin d'être ouvert au public (via le pare-feu externe). L'application Next.js (qui tourne sur le serveur) fera les requêtes HTTP localement en interne (`localhost`).*

---

## 🩺 5. Troubleshooting (Problèmes courants)

- **Erreur `libGL.so.1: cannot open shared object file`** : OpenCV manque de dépendances système. Installez `libgl1` sur le serveur Linux (`sudo apt-get install libgl1`).
- **Timeout sur la première requête** : Le modèle IA `u2net` n'a pas été pré-téléchargé. Laissez la requête échouer, le modèle est en train d'être téléchargé en arrière-plan (`~/.u2net/u2net.onnx`). Les prochaines marcheront.
- **Le port 3001 est déjà utilisé** : Si vous avez un autre service sur ce port, modifiez le `port=3001` dans `main.py` et n'oubliez pas de mettre à jour l'URL d'appel côté frontend Next.js.
