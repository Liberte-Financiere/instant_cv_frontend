// 1. Simulation d'une fonction d'extraction qui "explose" en mémoire
// comme le ferait une bombe PDF (génération infinie de données compressées)
async function extractTextFromBombPDF(signal) {
  return new Promise((resolve, reject) => {
    let memoryArray = [];
    let iteration = 0;

    const interval = setInterval(() => {
      // Vérifier si le signal d'annulation a été activé
      if (signal && signal.aborted) {
        clearInterval(interval);
        reject(new Error("⚠️ ANNULATION : Traitement stoppé par mesure de sécurité (Signal d'annulation reçu)."));
        return;
      }

      // Simulation de la décompression : on ajoute de grosses chaînes de caractères en RAM
      try {
        const chunk = "A".repeat(10 * 1024 * 1024); // 10 Mo par itération
        memoryArray.push(chunk);
        iteration++;

        // Affichage de la RAM consommée par Node.js
        const memoryUsed = process.memoryUsage().heapUsed / (1024 * 1024);
        console.log(`[Parseur] Itération ${iteration} | RAM consommée : ${memoryUsed.toFixed(2)} Mo`);

        // Alerte de sécurité interne du script
        if (memoryUsed > 200) { // Si la simulation dépasse 200 Mo de RAM, on l'arrête pour protéger votre PC
          clearInterval(interval);
          reject(new Error("🚨 ALERTE SÉCURITÉ : La mémoire allouée dépasse le seuil critique (200 Mo). Arrêt d'urgence pour éviter le Crash OOM !"));
        }
      } catch (err) {
        clearInterval(interval);
        reject(err);
      }
    }, 100); // Répéter toutes les 100ms
  });
}

// 2. Fonction principale avec notre bouclier de protection (Timeout + RAM Monitor)
async function runSafeExtraction() {
  console.log("=== Lancement de l'extraction sécurisée du PDF ===");
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.log("\n[Bouclier] ⏱️ Timeout de 2 secondes atteint !");
    controller.abort(); // Annule l'extraction
  }, 2000); // Limite de temps à 2 secondes

  try {
    const text = await extractTextFromBombPDF(controller.signal);
    console.log("Extraction terminée avec succès !");
    clearTimeout(timeoutId);
  } catch (error) {
    clearTimeout(timeoutId);
    console.log(`\n[Résultat] ${error.message}`);
  }
}

// Lancement du test
runSafeExtraction();
