@echo off
echo ==========================================
echo        SAUVEGARDE ET PUSH JOBSIRA         
echo ==========================================

echo [1/3] Ajout de tous les fichiers modifies...
git add .

echo [2/3] Creation du commit a partir de commit.txt...
git commit -F commit.txt

echo [3/3] Envoi vers le serveur distant (GitHub/GitLab)...
git push

echo ==========================================
echo               TERMINE !                   
echo ==========================================
