@echo off
echo ==============================================
echo Nettoyage des anciens dossiers Admin
echo ==============================================
echo.

echo ⚠️  ATTENTION : Assurez-vous d'avoir coupe votre serveur Next.js (Ctrl+C)
echo.

pause

echo.
echo Suppression de app\admin...
rmdir /s /q "app\admin"
if exist "app\admin" (
    echo [ECHEC] Le dossier app\admin n'a pas pu etre supprime. Verifiez qu'il n'est pas ouvert ailleurs.
) else (
    echo [OK] Dossier app\admin supprime avec succes !
)

echo.
echo Suppression de app\dashboard\admin...
rmdir /s /q "app\dashboard\admin"
if exist "app\dashboard\admin" (
    echo [ECHEC] Le dossier app\dashboard\admin n'a pas pu etre supprime.
) else (
    echo [OK] Dossier app\dashboard\admin supprime avec succes !
)

echo.
echo ==============================================
echo Nettoyage termine ! Vous pouvez relancer le serveur.
echo ==============================================
pause
