package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
)

func main() {
	// 1. Lire les variables d'environnement
	targetURL := os.Getenv("TARGET_URL")
	cronSecret := os.Getenv("CRON_SECRET")
	cronIntervalStr := os.Getenv("CRON_INTERVAL")

	if targetURL == "" {
		log.Fatal("L'erreur: TARGET_URL n'est pas défini (ex: http://nextjs:3000/api/cron/process-emails)")
	}

	if cronIntervalStr == "" {
		cronIntervalStr = "5m" // par défaut
	}

	// 2. Parser la durée (ex: 5m, 1h, 30s)
	interval, err := time.ParseDuration(cronIntervalStr)
	if err != nil {
		log.Fatalf("Erreur de parsing de CRON_INTERVAL (%s): %v", cronIntervalStr, err)
	}

	log.Printf("Cron Service Démarré.")
	log.Printf("- Cible: %s", targetURL)
	log.Printf("- Intervalle: %s", interval.String())
	log.Printf("- Sécurisé: %v", cronSecret != "")

	// 3. Lancer le Ticker
	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	// Exécuter immédiatement au démarrage (optionnel mais pratique)
	executeTask(targetURL, cronSecret)

	// Boucle infinie
	for {
		select {
		case t := <-ticker.C:
			log.Printf("--- Exécution du cron à %s ---", t.Format(time.RFC3339))
			executeTask(targetURL, cronSecret)
		}
	}
}

func executeTask(targetURL, secret string) {
	req, err := http.NewRequest(http.MethodGet, targetURL, nil)
	if err != nil {
		log.Printf("[ERREUR] Création de la requête impossible: %v", err)
		return
	}

	// Ajouter le Bearer token si défini
	if secret != "" {
		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", secret))
	}

	client := &http.Client{
		Timeout: 30 * time.Second, // Timeout pour éviter de bloquer indéfiniment
	}

	resp, err := client.Do(req)
	if err != nil {
		log.Printf("[ERREUR] Échec de l'appel HTTP: %v", err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 200 && resp.StatusCode < 300 {
		log.Printf("[SUCCÈS] Tâche exécutée (Statut: %d)", resp.StatusCode)
	} else {
		log.Printf("[ERREUR] Tâche refusée ou échouée (Statut: %d)", resp.StatusCode)
	}
}
