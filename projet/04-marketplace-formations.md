# Spécification Technique & Business : Marketplace de Formations Partenaires

## 1. Contexte & Problème Résolu
* **Problème :** L'analyse et le matching de CV révèlent des compétences manquantes (`missingSkills`). Les centres de formation locaux peinent à trouver des apprenants pour remplir leurs sessions.
* **Bénéfice :** JobSira connecte directement les candidats ayant un besoin de formation avec les organismes formateurs partenaires, sans avoir à produire de contenu vidéo.

---

## 2. Expérience Utilisateur

1. **Diagnostic Automatique :** Lors du matching CV vs Offre, l'IA affiche :
   * *« Compétence manquante détectée : Sage Saari 100 »*.
2. **Recommandation Contextuelle :**
   * Une carte propose : *« Formation Sage Saari à Ouaga (Centre X) — Prochaine session le 15 du mois »*.
3. **Mise en Relation Directe :**
   * Clic sur le bouton **« Contacter le centre sur WhatsApp »** avec message pré-rempli.

---

## 3. Modèle de Données Prisma Prévu

```prisma
enum TrainingFormat {
  PRESENTIAL
  ONLINE
  HYBRID
}

model TrainingCourse {
  id               String         @id @default(cuid())
  title            String
  slug             String         @unique
  organizationName String
  organizationLogo String?
  
  description      String         @db.Text
  targetAudience   String?
  skillsAcquired   String[]       // ["Sage 100", "Excel Avancé", "Fiscalité"]
  
  format           TrainingFormat @default(PRESENTIAL)
  city             String?        // "Ouagadougou", "Bobo-Dioulasso"
  address          String?
  
  startDate        DateTime?
  duration         String         // "3 semaines (40h)"
  schedule         String?        // "Cours du soir"
  
  price            Int            // Montant en FCFA (0 si gratuit)
  hasCertificate   Boolean        @default(true)
  
  whatsappContact  String         // Numéro WhatsApp direct
  emailContact     String?
  websiteUrl       String?

  isFeatured       Boolean        @default(false)
  isActive         Boolean        @default(true)
  viewsCount       Int            @default(0)
  leadsCount       Int            @default(0)

  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt

  @@index([city])
  @@index([isActive])
  @@index([isFeatured])
}
```

---

## 4. Modèle de Monétisation B2B

1. **Forfait Publication (Pay-per-Listing) :** 15 000 à 25 000 FCFA / annonce pour 30 jours de diffusion.
2. **Option "Mise en avant IA" :** 10 000 FCFA pour apparaître en top recommandation lors des diagnostics de CV.
3. **Forfait Annuel Organisme :** 150 000 FCFA / an pour des publications illimitées.

---

## 5. Fichiers & Routes à Créer
* Page Catalogue Public : `app/formations/page.tsx` et `app/formations/[slug]/page.tsx`
* Composant Recommandation : `components/dashboard/ai/TrainingRecommendations.tsx`
* Console Partenaire / Admin : `app/dashboard/admin/trainings/page.tsx`
* API : `app/api/trainings/route.ts` et `app/api/trainings/[id]/lead/route.ts`
