# Procédure de Suppression d'un Modèle de CV — JobSira

Ce document formalise la procédure standard d'ingénierie à suivre obligatoirement lors du retrait ou de la dépréciation d'un modèle de CV dans le projet JobSira.

---

## 1. Principes et Objectifs de Sécurité

La suppression d'un modèle de CV ne se limite pas à effacer un composant visuel. Tout retrait mal orchestré peut provoquer :
* Une erreur HTTP 400 bloquante lors de la sauvegarde d'un CV existant (rejet par la validation Zod).
* Un écran blanc ou crash React lors de l'ouverture d'un CV en base qui référence l'ancien modèle.
* Un échec d'export PDF via Puppeteer (`/api/pdf/generate`).
* Des onglets vides sur la page publique `/templates` si une catégorie d'utilisateurs (`etudiant`, `professionnel`, `reconversion`) se retrouve sans modèle.

**Règle absolue :** Zéro régression pour les utilisateurs existants. Tout CV référençant un modèle supprimé doit basculer automatiquement et sans erreur vers un modèle de repli stable (par défaut : `modern` — Le Moderne).

---

## 2. Matrice d'Impact Technique

Lors de la suppression d'un modèle `<templateId>` (composant `<TemplateComponent>.tsx`), les composants et couches suivants sont impactés :

| Couche | Fichier | Rôle de la modification |
| :--- | :--- | :--- |
| **Source de vérité** | `lib/templates.ts` | Retirer l'entrée du tableau `TEMPLATES`. |
| **Validation API** | `lib/schemas.ts` | `templateIdSchema` se met à jour automatiquement via `TEMPLATE_IDS`. |
| **Assainissement & Fallback** | `lib/utils.ts` | `sanitizeCVData` doit réassigner les IDs inconnus vers un modèle par défaut valide (`modern`). |
| **Interception API** | `app/api/cv/route.ts` & `app/api/cv/[id]/route.ts` | Assainir le payload entrant avant parsing Zod pour éviter l'erreur 400. |
| **Base de Données** | PostgreSQL (`CV.content`) | Migrer les enregistrements existants contenant l'ancien `templateId`. |
| **Aperçu Éditeur** | `components/editor/CVPreview.tsx` | Supprimer le `dynamic import` et le `case` dans `renderTemplate()`. |
| **Page Publique & PDF** | `app/cv/[id]/page.tsx` | Supprimer le `dynamic import` et le `case` dans `renderTemplate()`. |
| **Miniatures Dashboard** | `components/dashboard/CVThumbnail.tsx` | Supprimer le `dynamic import` et le `case` dans `renderTemplate()`. |
| **Composant UI** | `components/templates/<TemplateComponent>.tsx` | Suppression physique du fichier. |
| **Mocks & Données** | `lib/mock-cv-profiles.ts` / `TemplateDummyData.ts` | Réassigner si le modèle supprimé était utilisé en exemple. |
| **Store Zustand** | `store/useCVStore.ts` | Vérifier que `createNewCV` n'utilise pas le modèle supprimé en valeur par défaut. |
| **Marketing & SEO** | `README.md` & `app/templates/page.tsx` | Ajuster les compteurs de modèles (ex: "20+ modèles"). |
| **Tests Automatisés** | `__tests__/` | Créer et exécuter les tests de non-régression et de fallback. |

---

## 3. Procédure Séquentielle Étape par Étape

### Étape 1 : Audit préalable et vérification des catégories

1. **Vérifier l'impact sur les catégories :**
   Dans `lib/templates.ts`, examiner les champs `categories` du modèle à supprimer.
   S'assurer qu'après suppression, chacune des 3 catégories (`etudiant`, `professionnel`, `reconversion`) conserve au minimum **un** modèle actif.

2. **Vérifier les données en base PostgreSQL :**
   Exécuter la requête de comptage :
   ```sql
   SELECT count(*) 
   FROM "CV" 
   WHERE content->>'templateId' = '<templateId>';
   ```
   Noter le nombre d'enregistrements impactés.

---

### Étape 2 : Sécurisation du repli applicatif (Fallback)

1. **Dans `lib/utils.ts` (`sanitizeCVData`) :**
   Remplacer tout tableau de templates codé en dur par `TEMPLATE_IDS` :
   ```typescript
   import { TEMPLATE_IDS } from '@/lib/templates';

   // Si le templateId est absent ou n'est plus dans le catalogue actif
   if (!cleanData.templateId || !TEMPLATE_IDS.includes(cleanData.templateId)) {
     cleanData.templateId = 'modern'; // Modèle de repli garanti
   }
   ```

2. **Dans les routes API (`app/api/cv/route.ts` et `app/api/cv/[id]/route.ts`) :**
   S'assurer que `sanitizeCVData(body)` est exécuté **avant** `cvSchema.parse(body)` afin d'éviter le rejet Zod 400 sur un ancien ID.

---

### Étape 3 : Retrait de la source de vérité (`lib/templates.ts`)

1. Localiser l'objet du modèle dans `TEMPLATES` et supprimer son bloc de configuration :
   ```typescript
   // SUPPRIMER L'ENTRÉE DU MODÈLE CONCERNÉ
   {
     id: '<templateId>',
     name: '...',
     // ...
   }
   ```
2. Le type `TemplateId` et `TEMPLATE_IDS` se recalculent automatiquement à la compilation.

---

### Étape 4 : Nettoyage des aiguillages de rendu

Dans les trois fichiers suivants :
* `components/editor/CVPreview.tsx`
* `app/cv/[id]/page.tsx`
* `components/dashboard/CVThumbnail.tsx`

1. Supprimer l'import dynamique :
   ```typescript
   // Supprimer cette ligne :
   const TemplateComponent = dynamic(() => import('@/components/templates/<TemplateComponent>')...);
   ```
2. Supprimer la branche dans `renderTemplate()` :
   ```typescript
   // Supprimer ce bloc :
   case '<templateId>':
     return <TemplateComponent cv={...} />;
   ```
3. Vérifier que la clause `default:` redirige bien vers un modèle actif existant (ex: `ProfessionalClean` ou `ModernSidebar`).

---

### Étape 5 : Suppression physique du fichier du composant

1. Supprimer le fichier :
   ```bash
   rm components/templates/<TemplateComponent>.tsx
   ```
2. Vérifier si des sous-composants ou styles locaux n'étaient utilisés que par ce template, et les purger.

---

### Étape 6 : Migration SQL des données en base

Exécuter la mise à jour transactionnelle dans PostgreSQL :
```sql
BEGIN;

-- Mise à jour du templateId dans le document JSONB
UPDATE "CV"
SET "content" = jsonb_set("content", '{templateId}', '"professional"')
WHERE "content"->>'templateId' = '<templateId>';

-- Vérification post-migration
SELECT count(*) FROM "CV" WHERE "content"->>'templateId' = '<templateId>';
-- Doit retourner 0

COMMIT;
```

---

### Étape 7 : Création et Exécution des Tests Automatisés

Avant de valider, **écrire ou mettre à jour les tests** pour couvrir les cas suivants :

1. **Test de rejet par le schéma Zod (`__tests__/utils/schemas.test.ts`) :**
   ```typescript
   it('rejette l ancien templateId supprime', () => {
     const result = templateIdSchema.safeParse('<templateId>');
     expect(result.success).toBe(false);
   });
   ```

2. **Test du mécanisme de repli (`__tests__/utils/utils.test.ts`) :**
   ```typescript
   it('remplace automatiquement un templateId supprime par professional', () => {
     const sanitized = sanitizeCVData({ templateId: '<templateId>' });
     expect(sanitized.templateId).toBe('professional');
   });
   ```

3. **Test d intégrité du catalogue (`__tests__/lib/templates.test.ts`) :**
   ```typescript
   it('garantit au moins un modele par categorie utilisateur', () => {
     const categories = ['etudiant', 'professionnel', 'reconversion'] as const;
     categories.forEach(cat => {
       const hasTemplate = TEMPLATES.some(t => t.categories.includes(cat));
       expect(hasTemplate).toBe(true);
     });
   });

   it('ne contient aucun identifiant duplique', () => {
     const ids = TEMPLATES.map(t => t.id);
     const uniqueIds = new Set(ids);
     expect(uniqueIds.size).toBe(ids.length);
   });
   ```

4. **Exécuter l'ensemble de la suite de tests :**
   ```bash
   npm test
   ```
   Tous les tests doivent être au vert (`passed`).

5. **Vérifier la compilation TypeScript stricte :**
   ```bash
   npx tsc --noEmit
   ```
   Aucune erreur de type ne doit subsister.

---

### Étape 8 : Nettoyage Marketing, Documentation et Commit

1. Mettre à jour `README.md` et les textes promotionnels si un nombre précis de modèles est mentionné (ex: passer de "23+ templates" au nouveau nombre exact).
2. Rédiger l'entrée dans le fichier `commit.txt` à la racine :
   ```text
   [DATE] — Suppression du modèle CV <templateId>

   What changed:
   - Retrait du modèle <templateId> de lib/templates.ts
   - Suppression du composant components/templates/<TemplateComponent>.tsx
   - Nettoyage des imports dynamiques dans CVPreview, CVThumbnail et app/cv/[id]/page.tsx
   - Ajout du fallback automatique vers professional dans sanitizeCVData
   - Migration SQL des CVs existants en base de données
   - Ajout de tests unitaires couvrant le rejet et le repli du template

   Why:
   - Rationalisation du catalogue de modèles pour se concentrer sur les designs à forte valeur ajoutée.

   Files affected:
   - lib/templates.ts
   - lib/utils.ts
   - components/editor/CVPreview.tsx
   - components/dashboard/CVThumbnail.tsx
   - app/cv/[id]/page.tsx
   - components/templates/<TemplateComponent>.tsx
   - __tests__/utils/utils.test.ts
   - __tests__/utils/schemas.test.ts

   Breaking changes:
   - None (migration automatique en base et repli transparent à l'exécution).

   Notes for review:
   - Vérifier le bon passage de la suite de tests vitest.
   ```
