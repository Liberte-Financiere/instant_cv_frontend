# Spécification Technique & Produit : Job Application Tracker (Kanban)

## 1. Contexte & Problème Résolu
* **Problème :** Une fois son CV exporté, le candidat quitte JobSira. Il n'a aucun outil pour suivre ses candidatures (dates, relances, versions de CV envoyées, entretiens).
* **Bénéfice :** Transforme JobSira en une plateforme quotidienne de gestion de carrière, augmentant massivement la rétention hebdomadaire.

---

## 2. Expérience Utilisateur & Workflow

Le tracker se présente sous la forme d'un tableau Kanban avec 5 colonnes dynamiques (Glisser-Déposer via `@dnd-kit`) :

```
┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│  À POSTULER  │  CANDIDATURE │  ENTRETIEN   │ OFFRE REÇUE  │   REFUSÉ /   │
│  (Wishlist)  │   ENVOYÉE    │  PROGRAMMÉ   │  / ACCEPTÉE  │   ARCHIVÉ    │
├──────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ • Entreprise │ • Date envoi │ • Date & h   │ • Salaire    │ • Motif      │
│ • Titre job  │ • CV utilisé │ • Préparation│ • Décision   │ • Rétro      │
│ • Lien offre │ • Lettre liée│   IA directe │              │              │
└──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

---

## 3. Fonctionnalités Clés

1. **Création rapide de candidature :**
   * Saisie manuelle ou import d'offre d'emploi (URL ou texte).
   * Association d'un CV et d'une Lettre de motivation générés sur JobSira.
2. **Passerelle directe vers le Simulateur d'Entretien IA :**
   * En déplaçant une carte vers la colonne *"Entretien Programmé"*, un bouton propose : *« Lancer une simulation d'entretien IA personnalisée pour ce poste »*.
3. **Rappels & Relances :**
   * Alerte visuelle : *"Candidature envoyée il y a 7 jours sans réponse, pensez à relancer"*.

---

## 4. Modèle de Données Prisma Prévu

```prisma
enum ApplicationStatus {
  WISHLIST
  APPLIED
  INTERVIEW
  OFFER
  REJECTED
  ARCHIVED
}

model JobApplication {
  id              String            @id @default(cuid())
  userId          String
  user            User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  companyName     String
  companyLogo     String?
  jobTitle        String
  location        String?
  jobUrl          String?
  jobDescription  String?           @db.Text
  salary          String?
  
  status          ApplicationStatus @default(WISHLIST)
  order           Int               @default(0)
  
  // Relations avec les documents JobSira
  cvId            String?
  cv              CV?               @relation(fields: [cvId], references: [id], onDelete: SetNull)
  coverLetterId   String?
  coverLetter     CoverLetter?      @relation(fields: [coverLetterId], references: [id], onDelete: SetNull)
  
  appliedAt       DateTime?
  interviewAt     DateTime?
  notes           String?           @db.Text

  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt

  @@index([userId, status])
}
```

---

## 5. Fichiers & Routes à Créer
* Page UI : `app/dashboard/tracker/page.tsx`
* Composants : `components/tracker/KanbanBoard.tsx`, `components/tracker/ApplicationCard.tsx`, `components/tracker/ApplicationModal.tsx`
* API CRUD : `app/api/tracker/route.ts` et `app/api/tracker/[id]/route.ts`
