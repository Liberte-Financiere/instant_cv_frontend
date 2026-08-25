# Architecture & Documentation Complète des Microservices JobSira

Ce document fournit la spécification technique et la documentation détaillée, **fichier par fichier**, des **4 microservices** composant l'infrastructure backend distribuée de JobSira :

1. **`jobs_api`** (Go / Fiber) : Moteur d'agrégation, recherche, filtrage et tracking des offres d'emploi.
2. **`bg_removal`** (Python / FastAPI) : Détourage d'arrière-plan de photo de profil par intelligence artificielle (U2Net).
3. **`cron_service`** (Go) : Déclencheur périodique léger et scheduler de tâches d'arrière-plan.
4. **`email_service`** (Python / FastAPI) : Moteur de rendu HTML (Jinja2) et d'expédition transactionnelle (Brevo API v3).

---

## 1. Vue d'Ensemble de l'Écosystème

```
                                  ┌──────────────────────────────────────────────┐
                                  │       NEXT.JS 16 APP ROUTER (Port 3000)      │
                                  └──────┬──────────────┬──────────────┬─────────┘
                                         │              │              │
                    GET /api/v1/opps     │              │ POST /rem-bg │ POST /v1/emails/send
                    (Requêtes Offres)    │              │ (Buffer img) │ (Payload JSON)
                                         ▼              ▼              ▼
┌─────────────────────────────────────────────┐ ┌──────────────┐ ┌────────────────────────────────────────┐
│ 1. jobs_api (Go / Fiber - Port 8080)        │ │ 2. bg_removal│ │ 4. email_service (Python - Port 3002)   │
│ • PostgreSQL Connection Pool (pgx v5)       │ │  (Python)    │ │ • Rendu de templates Jinja2            │
│ • Cache Mémoire TTL thread-safe             │ │  Port : 3001 │ │ • Client Async HTTPX ➔ Brevo API v3   │
│ • Endpoints Filtrage, Recherche, Stats      │ │ • Rembg U2Net│ └────────────────────────────────────────┘
└─────────────────────────────────────────────┘ └──────────────┘
                                                       ▲
                                                       │ HTTP Ping /api/cron (Intervalle régulier)
                                                       │
                                        ┌──────────────────────────────┐
                                        │ 3. cron_service (Go Daemon)  │
                                        │ • Ticker temps réel natif    │
                                        │ • Envoi du Bearer Cron Secret│
                                        └──────────────────────────────┘
```

---

## 2. Microservice 1 : `jobs_api` (Moteur d'Offres d'Emploi & Opportunités)

* **Emplacement :** `microservices/jobs_api/`
* **Langage & Framework :** Go (Golang 1.22+), Fiber v2, pgx/v5 (PostgreSQL Pool).
* **Port par défaut :** `8080` (Configurable via la variable d'environnement `PORT`).
* **Base de données :** PostgreSQL (Neon / Instance dédiée).

```
microservices/jobs_api/
├── cmd/
│   └── server/
│       └── main.go                 <-- Point d'entrée principal du serveur HTTP
├── internal/
│   ├── cache/
│   │   └── memory.go               <-- Cache en mémoire thread-safe avec TTL & cleanup
│   ├── config/
│   │   └── config.go               <-- Chargement et validation des variables d'environnement
│   ├── database/
│   │   └── postgres.go             <-- Pool de connexions PostgreSQL (pgxpool)
│   ├── handlers/
│   │   ├── opportunities.go        <-- Handlers CRUD, filtres, pagination par curseur
│   │   ├── search.go               <-- Autocomplétion et recherche de titres
│   │   ├── filters.go              <-- Valeurs distinctes pour les filtres UI
│   │   ├── stats.go                <-- Statistiques globales et distributions
│   │   ├── tracking.go             <-- Incrémentation asynchrone des vues et clics
│   │   └── internal.go             <-- Healthcheck & invalidation du cache
│   ├── middleware/
│   │   ├── apikey.go               <-- Sécurité d'authentification par clé API interne
│   │   ├── cors.go                 <-- Configuration des en-têtes CORS
│   │   ├── logger.go               <-- Journalisation structurée des requêtes
│   │   ├── ratelimit.go            <-- Limitation du débit de requêtes (Rate Limiting)
│   │   └── recovery.go             <-- Récupération sur panique (Panic Recovery)
│   ├── models/
│   │   ├── opportunity.go          <-- Structures de données des opportunités
│   │   ├── filters.go              <-- Structures des filtres dynamiques
│   │   ├── stats.go                <-- Modèles de statistiques et métriques
│   │   ├── attachment.go           <-- Modèle des pièces jointes (fiches de poste)
│   │   └── response.go             <-- Format standardisé des réponses API JSON
│   └── router/
│       └── router.go               <-- Déclaration des routes et injection des dépendances
├── .env.example
├── Dockerfile
├── go.mod
└── go.sum
```

---

### Analyse Fichier par Fichier (`jobs_api`)

#### 1. [`cmd/server/main.go`](file:///home/bikienga/Documents/BUSSINESS/saas_cv_lm/frontend/instant_cv/microservices/jobs_api/cmd/server/main.go)
* Initialise le logger JSON structuré standard de Go (`log/slog`).
* Charge la configuration depuis les variables d'environnement (`config.Load()`).
* Initialise le pool de connexions PostgreSQL (`database.NewPool()`).
* Crée l'instance de cache en mémoire (`cache.New()`).
* Démarre le serveur Fiber sur le port configuré avec un gestionnaire global d'erreurs JSON.

#### 2. [`internal/config/config.go`](file:///home/bikienga/Documents/BUSSINESS/saas_cv_lm/frontend/instant_cv/microservices/jobs_api/internal/config/config.go)
* Définit la structure `Config` : `Port`, `Environment`, `DatabaseURL` (variable `NEON_DB`), `APIKey`, `CORSAllowedOrigins`, et les durées TTL du cache (`CacheTTLDefault = 5m`, `CacheTTLFilters = 30m`, `CacheTTLStats = 15m`).

#### 3. [`internal/database/postgres.go`](file:///home/bikienga/Documents/BUSSINESS/saas_cv_lm/frontend/instant_cv/microservices/jobs_api/internal/database/postgres.go)
* Configure un pool haute performance `pgxpool.Pool` :
  * `MaxConns = 10`, `MinConns = 2`.
  * `MaxConnLifetime = 30m`, `MaxConnIdleTime = 5m`.
  * Effectue un `Ping()` de validation avec timeout de 10s au démarrage.

#### 4. [`internal/cache/memory.go`](file:///home/bikienga/Documents/BUSSINESS/saas_cv_lm/frontend/instant_cv/microservices/jobs_api/internal/cache/memory.go)
* Système de cache clé-valeur en mémoire thread-safe (`sync.RWMutex`).
* Intègre une goroutine de fond (`cleanup`) qui purge automatiquement les entrées expirées toutes les 2 minutes pour éviter les fuites de mémoire.

#### 5. [`internal/handlers/opportunities.go`](file:///home/bikienga/Documents/BUSSINESS/saas_cv_lm/frontend/instant_cv/microservices/jobs_api/internal/handlers/opportunities.go)
* **`List` (`GET /api/v1/opportunities`) :** Récupère les opportunités actives avec pagination par curseur (haute performance sur gros volumes) et filtrage multi-critères (secteur, pays, type de contrat, télétravail, recherche textuelle).
* **`GetByID` (`GET /api/v1/opportunities/:id`) :** Retourne le détail complet d'une opportunité avec ses pièces jointes associées (`opportunity_attachments`).
* **`Similar` (`GET /api/v1/opportunities/:id/similar`) :** Trouve les opportunités similaires par secteur ou pays.
* **`Trending` (`GET /api/v1/opportunities/trending`) :** Retourne les opportunités prioritaires avec mise en cache (TTL 5 min).
* **`ExpiringSoon` (`GET /api/v1/opportunities/expiring-soon`) :** Récupère les offres dont la date limite expire dans les 7 prochains jours.

#### 6. [`internal/handlers/search.go`](file:///home/bikienga/Documents/BUSSINESS/saas_cv_lm/frontend/instant_cv/microservices/jobs_api/internal/handlers/search.go)
* **`Suggest` (`GET /api/v1/search/suggest?q=...`) :** Autocomplétion instantanée des titres d'opportunités actives (requiert au minimum 2 caractères).

#### 7. [`internal/handlers/filters.go`](file:///home/bikienga/Documents/BUSSINESS/saas_cv_lm/frontend/instant_cv/microservices/jobs_api/internal/handlers/filters.go)
* **`GetFilters` (`GET /api/v1/filters`) :** Récupère en parallèle l'ensemble des valeurs distinctes existantes en base (types de contrats, secteurs, villes, pays, niveaux d'études) avec cache de 30 minutes pour alimenter dynamiquement les menus déroulants de l'UI.

#### 8. [`internal/handlers/tracking.go`](file:///home/bikienga/Documents/BUSSINESS/saas_cv_lm/frontend/instant_cv/microservices/jobs_api/internal/handlers/tracking.go)
* **`RecordView` & `RecordClick` (`POST /api/v1/opportunities/:id/view|click`) :** Écritures asynchrones ("Fire-and-forget" via goroutines sans bloquer la réponse HTTP) pour incrémenter le score de popularité (`priority_score`).

#### 9. [`internal/handlers/internal.go`](file:///home/bikienga/Documents/BUSSINESS/saas_cv_lm/frontend/instant_cv/microservices/jobs_api/internal/handlers/internal.go)
* **`Health` (`GET /api/v1/health`) :** Vérification de l'état de santé du service et du ping base de données pour les healthchecks Docker.
* **`CacheInvalidate` (`POST /api/v1/internal/cache/invalidate`) :** Vidage manuel immédiat du cache mémoire, sécurisé par clé API.

#### 10. [`internal/middleware/`](file:///home/bikienga/Documents/BUSSINESS/saas_cv_lm/frontend/instant_cv/microservices/jobs_api/internal/middleware)
* **`apikey.go` :** Valide l'en-tête `X-API-Key` pour protéger les routes internes d'administration.
* **`cors.go` :** Gère les origines autorisées et les méthodes HTTP acceptées.
* **`logger.go` :** Enregistre la durée de chaque requête, son statut et l'IP du client.
* **`ratelimit.go` :** Bloque les abus à 100 requêtes par minute par client.
* **`recovery.go` :** Intercepte tout crash inattendu pour retourner un code HTTP 500 propre au lieu d'interrompre le processus.

---

## 3. Microservice 2 : `bg_removal` (Détourage Photo IA)

* **Emplacement :** `microservices/bg_removal/`
* **Langage & Framework :** Python 3.12, FastAPI, Uvicorn, Pillow, Rembg (U2Net).
* **Port par défaut :** `3001`.

```
microservices/bg_removal/
├── Dockerfile          <-- Image Python slim avec bibliothèques C pour ONNX/OpenCV
├── requirements.txt    <-- fastapi, uvicorn, rembg, pillow, python-multipart
└── main.py             <-- Pipeline de détourage avec gestion de concurrence
```

---

### Analyse des Fichiers (`bg_removal`)

#### [`microservices/bg_removal/main.py`](file:///home/bikienga/Documents/BUSSINESS/saas_cv_lm/frontend/instant_cv/microservices/bg_removal/main.py)
* **Pré-chargement U2Net :** Initialise le modèle de segmentation d'image dès le démarrage (`new_session("u2net")`).
* **Protection Decompression Bomb :** Limite Pillow à 25 millions de pixels maximum.
* **Sécurité Taille :** Rejette immédiatement les images supérieures à 10 Mo.
* **Limitation de Concurrence :** Utilise un `asyncio.Semaphore(4)` et 2 workers Uvicorn pour préserver la RAM du serveur VPS tout en assurant le parallélisme.
* **Endpoint `POST /remove-bg` :** Traite l'image de manière asynchrone et renvoie le flux binaire PNG transparent.

---

## 4. Microservice 3 : `cron_service` (Déclencheur de Tâches en Go)

* **Emplacement :** `microservices/cron_service/`
* **Langage :** Go (Golang 1.22+).
* **Consommation mémoire :** $< 15$ Mo de RAM.

```
microservices/cron_service/
├── Dockerfile          <-- Multi-stage build produisant un binaire léger de ~10 Mo
└── main.go             <-- Boucle Ticker infinie & client HTTP sécurisé
```

---

### Analyse des Fichiers (`cron_service`)

#### [`microservices/cron_service/main.go`](file:///home/bikienga/Documents/BUSSINESS/saas_cv_lm/frontend/instant_cv/microservices/cron_service/main.go)
* **Configuration :** Lit `TARGET_URL` (URL Next.js ciblée), `CRON_INTERVAL` (fréquence, défaut: `5m`), et `CRON_SECRET`.
* **Exécution Périodique :** Utilise `time.NewTicker` pour déclencher les jobs sans dérive d'horloge.
* **Sécurité :** Transmet le jeton `Authorization: Bearer <CRON_SECRET>` pour autoriser l'exécution de la route API Next.js [`/api/cron/process-emails`](file:///home/bikienga/Documents/BUSSINESS/saas_cv_lm/frontend/instant_cv/app/api/cron/process-emails/route.ts).

---

## 5. Microservice 4 : `email_service` (Transporteur d'Emailing & Jinja2)

* **Emplacement :** `microservices/email_service/`
* **Langage & Framework :** Python 3.12, FastAPI, Jinja2, HTTPX, Brevo API v3.
* **Port par défaut :** `3002`.

```
microservices/email_service/
├── Dockerfile
├── requirements.txt
├── main.py
└── templates/
    └── b2b_invitation.html   <-- Gabarit HTML responsive pour les invitations écoles
```

---

### Analyse des Fichiers (`email_service`)

#### [`microservices/email_service/main.py`](file:///home/bikienga/Documents/BUSSINESS/saas_cv_lm/frontend/instant_cv/microservices/email_service/main.py)
* **Sécurité d'API :** Valide l'en-tête `x-internal-api-key`.
* **Moteur Jinja2 :** Charge les gabarits dans `templates/` et injecte les variables transmises (nom, prénom, code d'activation, nom de l'école).
* **Expédition Brevo :** Appelle l'API Brevo v3 (`https://api.brevo.com/v3/smtp/email`) de manière asynchrone via `httpx.AsyncClient`.
* **Endpoint `POST /v1/emails/send` :** Reçoit le payload de l'application Next.js ([`lib/email-client.ts`](file:///home/bikienga/Documents/BUSSINESS/saas_cv_lm/frontend/instant_cv/lib/email-client.ts)) et retourne l'identifiant du message expédié.

---

## 6. Synthèse des Ports & Variables d'Environnement

| Microservice | Langage | Port | Variables d'environnement requises |
| :--- | :--- | :---: | :--- |
| **`jobs_api`** | Go / Fiber | `8080` | `NEON_DB`, `PORT`, `API_KEY`, `CORS_ALLOWED_ORIGINS` |
| **`bg_removal`** | Python / FastAPI | `3001` | *(Aucune variable externe obligatoire)* |
| **`cron_service`** | Go | *Host* | `TARGET_URL`, `CRON_INTERVAL`, `CRON_SECRET` |
| **`email_service`** | Python / FastAPI | `3002` | `BREVO_API_KEY`, `INTERNAL_API_KEY`, `SENDER_EMAIL`, `SENDER_NAME` |
