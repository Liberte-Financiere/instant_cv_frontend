# Spécification Technique & Produit : 1-Click CV to Portfolio & QR Code

## 1. Contexte & Problème Résolu
* **Problème :** Un CV papier ou PDF d'une seule page est insuffisant pour prouver les compétences réelles (projets tech, designs, études de cas, photos de chantiers).
* **Bénéfice :** En 1 clic, le candidat active son site web personnel dynamique avec un QR code dynamique injecté sur son CV PDF.

---

## 2. Expérience Utilisateur

1. **Génération Instantanée :** Le candidat clique sur *"Activer mon site web portfolio"* dans son dashboard.
2. **Attribution d'une URL personnalisée :** `jobsira.com/p/[slug]` (ex: `jobsira.com/p/ibrahim-sawadogo`).
3. **Showcase de Réalisations :** Ajout de cartes projets avec captures d'écran, liens GitHub, démos live, fichiers téléchargeables.
4. **Bouton WhatsApp direct :** Les recruteurs peuvent contacter le candidat immédiatement en 1 clic.
5. **QR Code Dynamique sur le CV Papier :** Le recruteur scanne le CV imprimé et atterrit sur le portfolio.

---

## 3. Modèle de Données Prisma Prévu

```prisma
model Portfolio {
  id              String         @id @default(cuid())
  userId          String         @unique
  user            User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  cvId            String?        @unique
  
  slug            String         @unique // jobsira.com/p/nom-prenom
  theme           String         @default("minimal-dark") // "minimal-dark", "modern-clean", "creative-tech"
  isPublished     Boolean        @default(true)
  
  bio             String?        @db.Text
  customLinks     Json?          // GitHub, Behance, LinkedIn, Site perso
  projects        ProjectMedia[]
  
  // Analytics & Rétention Candidat
  viewsCount      Int            @default(0)
  whatsappClicks  Int            @default(0)
  cvDownloads     Int            @default(0)

  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  @@index([slug])
  @@index([isPublished])
}

model ProjectMedia {
  id              String         @id @default(cuid())
  portfolioId     String
  portfolio       Portfolio      @relation(fields: [portfolioId], references: [id], onDelete: Cascade)
  title           String
  description     String?        @db.Text
  imageUrl        String?
  liveUrl         String?
  githubUrl       String?
  tags            String[]
  order           Int            @default(0)
}
```

---

## 4. Intégration QR Code dans le Moteur PDF

* Dans `lib/pdf-export.ts` et les templates de CV :
  * Si `portfolio.isPublished === true`, générer un QR Code SVG via la librairie `qrcode` pointant vers `${NEXT_PUBLIC_APP_URL}/p/${portfolio.slug}`.
  * Afficher le QR Code élégamment dans l'en-tête ou le pied de page du CV avec la mention *"Scannez pour voir mes réalisations"*.

---

## 5. Fichiers & Routes à Créer
* Page Publique SSR : `app/p/[slug]/page.tsx` (avec OpenGraph tags pour WhatsApp/LinkedIn)
* Page Gestion : `app/dashboard/portfolio/page.tsx`
* Composants : `components/portfolio/HeroSection.tsx`, `components/portfolio/ProjectsGallery.tsx`, `components/portfolio/ThemeSelector.tsx`
* API CRUD : `app/api/portfolio/route.ts` et `app/api/portfolio/[id]/route.ts`
