from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import Response
from rembg import remove, new_session
from PIL import Image
import io
import asyncio
import logging

# Configuration de la journalisation (Logging)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("rembg-service")

# Sécurité 1: Protection contre les bombes de décompression (Decompression Bomb)
Image.MAX_IMAGE_PIXELS = 25_000_000  # Max ~5000x5000

# Sécurité 2: Limite de taille de fichier en mémoire (10 Mo)
MAX_FILE_SIZE = 10 * 1024 * 1024

# Sécurité 3: Limite de concurrence CPU (4 workers sur VPS)
CONCURRENCY_LIMIT = 4
semaphore = asyncio.Semaphore(CONCURRENCY_LIMIT)

# Performance 1: Pré-chargement du modèle IA en mémoire une seule fois au démarrage
logger.info("Chargement du modèle U2Net en mémoire...")
session = new_session("u2net")
logger.info("Modèle chargé avec succès.")

app = FastAPI(title="Rembg Microservice")

@app.post("/remove-bg")
async def remove_background(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Le fichier doit être une image")
    
    try:
        # Lecture avec limite de taille
        contents = await file.read()
        if len(contents) > MAX_FILE_SIZE:
            raise HTTPException(status_code=413, detail="Image trop volumineuse (max 10 Mo)")
            
        # Validation stricte de l'image
        try:
            input_image = Image.open(io.BytesIO(contents))
            input_image.verify()  # Détecte les fichiers corrompus/malveillants
            input_image = Image.open(io.BytesIO(contents))  # Réouverture nécessaire après verify()
        except Exception:
            raise HTTPException(status_code=400, detail="Image invalide ou corrompue")
        
        # Exécution avec limite de concurrence et session préchargée
        async with semaphore:
            output_image = await asyncio.to_thread(remove, input_image, session=session)
        
        # Sauvegarde optimisée
        img_byte_arr = io.BytesIO()
        output_image.save(img_byte_arr, format='PNG')
        img_byte_arr = img_byte_arr.getvalue()
        
        return Response(content=img_byte_arr, media_type="image/png")
        
    except HTTPException:
        raise # On laisse passer les erreurs HTTP qu'on a levées nous-mêmes
    except Exception as e:
        logger.error(f"Erreur interne lors du traitement : {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Erreur interne du serveur lors du détourage")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)
