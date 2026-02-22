# JobSira 🚀

**JobSira** est une plateforme de création de CV et lettres de motivation propulsée par l'IA, conçue pour le marché africain et international. Créez, personnalisez et partagez vos documents professionnels en quelques clics.

---

## ✨ Fonctionnalités principales

### 🤖 Intelligence Artificielle
- **Génération de CV** — L'IA reformule vos expériences et génère du contenu professionnel
- **Lettres de motivation** — Génération automatique adaptée à chaque offre d'emploi
- **Analyse de CV** — Import PDF et diagnostic IA (forces, faiblesses, suggestions)
- **Matching CV / Offre** — Comparaison de votre profil avec une offre d'emploi
- **Correction & Traduction** — Optimisation automatique FR/EN
- *Propulsé par Google Gemini 2.5*

### 🎨 Éditeur de CV
- **23+ Templates Professionnels** — Moderne, Classique, Créatif, Tech, ATS, Minimaliste, et bien plus
- **Personnalisation complète** — Couleurs, polices, mise en page, photo
- **Réorganisation Drag & Drop** — Réordonnez les sections par glisser-déposer
- **Prévisualisation temps réel** — Voir les changements instantanément
- **Auto-save** — Sauvegarde automatique toutes les 4 secondes

### ✉️ Lettres de Motivation
- **Éditeur dédié** — Interface complète pour créer et éditer vos lettres
- **Génération IA** — Contenu adapté au poste et à l'entreprise ciblée
- **Templates multiples** — Plusieurs styles de mise en page
- **Export PDF** — Export haute qualité

### 📤 Export & Partage
- **Export PDF HD** — Génération de PDF respectant la mise en page
- **Export Word** (.docx) — Document éditable
- **Partage par lien** — Page publique `/cv/[id]` et `/cover-letter/[id]`
- **Smart Pagination** — Gestion intelligente des sauts de page

### 💎 Système de Crédits
- **25 crédits gratuits** à l'inscription
- **Packs payants** — Standard (35 cr.), Premium (80 cr.), Pro (250 cr.)
- **Paiement via WhatsApp** — Wave, Orange Money, etc.
- **Crédits sans expiration** — Valables à vie

### 🎁 Programme de Parrainage
- **Code unique** par utilisateur
- **Bonus crédits** pour le parrain et le filleul
- **Partage facile** via lien ou copie

### 📱 Progressive Web App (PWA)
- **Installable** sur mobile et desktop
- **Fonctionne hors connexion** pour l'édition
- **Notifications** (à venir)

---

## 🛠️ Stack Technique

| Catégorie | Technologie |
|-----------|-------------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **Langage** | TypeScript (strict mode) |
| **Base de données** | PostgreSQL + [Prisma ORM](https://www.prisma.io/) |
| **Auth** | [NextAuth.js v5](https://authjs.dev/) (Google Sign-In) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **State** | [Zustand](https://zustand-demo.pmnd.rs/) (persist IndexedDB) |
| **IA** | Google Gemini 2.5 Flash |
| **Monitoring** | [Sentry](https://sentry.io/) |
| **Storage** | [Cloudinary](https://cloudinary.com/) (photos profil) |
| **Export** | docx, file-saver, html2canvas |

### Structure du projet

```text
app/
├── api/               # Routes API (cv, ai, referral, admin, upload)
├── auth/              # Page d'authentification
├── dashboard/         # Dashboard, templates, pricing, settings, admin
├── editor/[id]/       # Éditeur de CV
├── cover-letter/      # Éditeur et preview lettres de motivation
├── etudiants/         # Page dédiée étudiants
├── professionnels/    # Page dédiée professionnels
├── reconversion/      # Page dédiée reconversion
├── analysis/          # Résultats d'analyse IA
components/
├── templates/         # 23+ templates CV
├── cv-sections/       # Composants modulaires CV
├── editor/            # Éditeur (formulaires, preview, outils)
├── dashboard/         # Sidebar, StatCard, ReferralSection
├── landing/           # Hero, Features, Pricing, Testimonials, FAQ
├── cover-letter/      # Éditeur et preview lettres
├── shared/            # Navbar, composants partagés
└── ui/                # Composants réutilisables (SectionHeader, Pagination)
lib/                   # Config, utils, schemas, rate-limit, pdf-export
store/                 # Zustand stores (CV, CoverLetter, Credit)
types/                 # Types TypeScript
prisma/                # Schema et migrations
```

---

## 🚀 Installation

```bash
# Cloner le projet
git clone https://github.com/votre-username/jobsira.git
cd jobsira

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Remplir : DATABASE_URL, GOOGLE_API_KEY, AUTH_SECRET, etc.

# Initialiser la base de données
npx prisma db push
npx prisma generate

# Lancer le serveur de développement
npm run dev
```

### Variables d'environnement requises

```env
DATABASE_URL=postgresql://...
AUTH_SECRET=...
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
GOOGLE_API_KEY=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NEXT_PUBLIC_SENTRY_DSN=...
```

### SQL Setup (Supabase)

Après `prisma db push`, exécuter ces requêtes dans l'éditeur SQL de Supabase :

```sql
-- 1. Table de transactions de crédits
CREATE TABLE IF NOT EXISTS "CreditTransaction" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL,
  "type" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CreditTransaction_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CreditTransaction_userId_fkey" FOREIGN KEY ("userId") 
    REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "CreditTransaction_userId_idx" ON "CreditTransaction"("userId");

-- 2. Enum et colonne Role (pour les admins)
DO $$ BEGIN
  CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" "Role" NOT NULL DEFAULT 'USER';

-- 3. Définir les administrateurs
UPDATE "User" SET "role" = 'ADMIN' 
WHERE "email" IN ('m9bikienga@gmail.com', 'optijob18@gmail.com');
```

---

## 📖 Utilisation

1. **S'inscrire** — Connexion via Google (25 crédits offerts)
2. **Créer un CV** — Choisir un template parmi 23+ modèles
3. **Rédiger** — Remplir les sections avec l'aide de l'IA
4. **Personnaliser** — Couleurs, photo, ordre des sections
5. **Exporter** — PDF ou Word
6. **Lettre de motivation** — Générer une lettre adaptée à chaque offre
7. **Partager** — Lien public vers votre CV

---

## 👥 Pages dédiées

| Page | URL | Audience |
|------|-----|----------|
| Étudiants | `/etudiants` | Stages, premiers emplois |
| Professionnels | `/professionnels` | Cadres, postes de direction |
| Reconversion | `/reconversion` | Changement de carrière |

---

## 🔐 Administration

- **Panel admin** : `/dashboard/admin` (non visible dans la navigation)
- **Accès** : rôle `ADMIN` ou emails autorisés (`m9bikienga@gmail.com`, `optijob18@gmail.com`)
- **Fonctionnalités** : recherche d'utilisateurs, rechargement manuel de crédits
- **Workflow** : client contacte via WhatsApp → admin recharge manuellement → crédits ajoutés instantanément
- **Rôles** : `USER` (défaut) et `ADMIN` (défini via SQL dans Supabase)

---

*© 2026 JobSira — Propulsé par l'IA pour l'Afrique et le monde.*

