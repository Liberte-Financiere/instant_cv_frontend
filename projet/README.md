# Roadmap & Projets Planifiés — JobSira

Ce dossier centralise les spécifications, études fonctionnelles et fiches techniques des fonctionnalités et projets stratégiques à implémenter.

---

## 1. Vue d'Ensemble des Chantiers Stratégiques

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                       FEUILLE DE ROUTE PRODUIT JOBSIRA                          │
├───────────────────────┬─────────────────────────┬───────────────────────────────┤
│ PRIORITÉ 1 (Court terme)│ PRIORITÉ 2 (Moyen terme)│ PRIORITÉ 3 (Monétisation B2B) │
│ • Job Application     │ • 1-Click Portfolio     │ • Marketplace Formations      │
│   Tracker (Kanban)    │   (Showcase + QR Code)  │   Partenaires (WhatsApp Leads)│
│ • Nettoyage Code Bloat│ • Réseau Secrétariats   │ • Candidatures Directes 1-Clic│
│                       │   Publics (Agents Cash) │                               │
│                       │ • JobBot WhatsApp       │                               │
└───────────────────────┴─────────────────────────┴───────────────────────────────┘
```

---

## 2. Fiches Récapitulatives des Projets

### [01. Job Application Tracker (Suivi de Candidatures)](./01-job-tracker.md)
* **Objectif :** Résoudre le problème de la rétention en créant un tableau de bord quotidien pour suivre l'état de ses candidatures.
* **Format :** Tableau Kanban dynamique avec 5 colonnes (*À postuler* $\rightarrow$ *Candidature envoyée* $\rightarrow$ *Entretien programmé* $\rightarrow$ *Offre reçue* $\rightarrow$ *Refusée/Archivée*).
* **Valeur métier :** Fait revenir l'utilisateur sur la plateforme chaque semaine plutôt qu'uniquement le jour de la création de son CV.

---

### [02. 1-Click CV-to-Portfolio & QR Code Dynamique](./02-portfolio-builder.md)
* **Objectif :** Permettre aux candidats (Tech, Design, Finance, Ingénierie) d'avoir un site web personnel de réalisations sans effort.
* **Fonctionnalités :**
  * Génération instantanée d'une URL publique (`jobsira.com/p/nom-prenom`) à partir des données du CV.
  * Showcase de projets avec captures d'écran, liens de démo live, fichiers PDF et GitHub.
  * Bouton direct de contact WhatsApp.
  * **QR Code dynamique** généré automatiquement sur le CV papier/PDF renvoyant vers le portfolio.
  * Statistiques de visites pour le candidat (*"3 recruteurs ont consulté votre portfolio"*).

---

### [03. Offre "JobSira Agent" (Réseau de Secrétariats Publics & Cybercafés)](./03-agent-cybercafes.md)
* **Objectif :** Capter le marché physique non connecté et les candidats payant en espèces.
* **Modèle :**
  * Compte Agent / Cybercafé avec gestion multi-clients.
  * Pack grossiste de crédits (ex: 250 FCFA le CV).
  * Le gérant saisit le CV en 3 minutes via l'IA, encaisse 1 500 à 2 000 FCFA en cash du client et réalise une marge nette de 85%.
  * Kit physique : Affichette vitrine + Catalogue papier des 20 templates imprimés.

---

### [04. Marketplace de Formations Partenaires (Skill-Gap Bridging)](./04-marketplace-formations.md)
* **Objectif :** Monétiser les écarts de compétences détectés par l'IA sans produire de cours soi-même.
* **Fonctionnalités :**
  * Catalogue d'annonces de formations certifiantes (Présentiel Ouaga/Bobo et En ligne).
  * Recommandation contextuelle automatique après diagnostic du CV : *"Il vous manque Sage Saari ? Voici 2 sessions à Ouaga ce mois-ci"*.
  * Bouton de redirection directe vers le WhatsApp de l'organisme formateur.
  * **Monétisation :** Forfait de publication (15 000 à 25 000 FCFA / annonce 30 jours) ou coût au contact qualifié généré.

---

### [05. JobBot WhatsApp (Acquisition Virale & Audit Flash)](./05-job-bot-whatsapp.md)
* **Objectif :** Capter massivement des candidats là où ils se trouvent (sur WhatsApp).
* **Fonctionnalités :**
  * L'étudiant envoie son CV en PDF sur le numéro WhatsApp de JobSira.
  * L'IA analyse le fichier et renvoie :
    1. Une note sur 10.
    2. Les 3 erreurs critiques détectées.
    3. Un lien pour modifier et corriger son CV sur JobSira en 1 clic.

---

## 3. Structure des Fichiers dans ce Dossier

* [`01-job-tracker.md`](./01-job-tracker.md) : Spécifications UI, schéma Prisma et routes API du Kanban de candidatures.
* [`02-portfolio-builder.md`](./02-portfolio-builder.md) : Modèle de données, composants web et intégration du QR Code.
* [`03-agent-cybercafes.md`](./03-agent-cybercafes.md) : Script commercial, packaging des crédits et kits boutiques.
* [`04-marketplace-formations.md`](./04-marketplace-formations.md) : Modèle de publication d'annonces de formation et flux WhatsApp.
* [`05-job-bot-whatsapp.md`](./05-job-bot-whatsapp.md) : Architecture du webhook et flux d'audit rapide.
