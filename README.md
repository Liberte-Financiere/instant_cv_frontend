# OptiJob 🚀

**OptiJob** est votre coach carrière personnel alimenté par l'IA, conçu spécifiquement pour le marché africain et international.
Notre plateforme analyse votre profil, optimise votre CV pour les ATS et vous fournit des outils professionnels (Signature, Lettres) en un clic.

---

## ✨ Fonctionnalités & Design (v1.0)

### 🎨 Expérience "Hyper Pro"

- **Thème Premium** : Esthétique soignée (`#0F172A`) avec typographie **Manrope**.
- **Composants Modernes** : Accordéons, Bento Grids, Cartes interactives.
- **Micro-interactions** : Effets de survol et animations fluides (Framer Motion).

> 👉 **[Voir toutes les fonctionnalités en détail](./FEATURES.md)**

### ⚡ Bento Grid (Fonctionnalités Clés)

Une suite complète d'outils pour votre carrière :

1.  **Coach IA & Magic Analyzer** : Scannez votre CV et obtenez un score instantané.
2.  **Éditeur Temps Réel** : Formulaire simple page (Accordéons) + Aperçu Live.
3.  **Signature Électronique** : Module de signature intégré.
4.  **Lettres de Motivation** : Gestionnaire de lettres dédié.
5.  **Templates Pro** : Modèles adaptés à chaque industrie (Tech, Corporate...).
6.  **Export PDF HD** : Rendu vectoriel parfait pour l'impression.

### 👥 Ciblage Audience (Vibrant)

Design distinctif pour chaque cible :

- **Étudiants** : Carte Vert Menthe (Fraîcheur, Début).
- **Professionnels** : Carte Bleu Nuit (Sérieux, Leadership).
- **Reconversion** : Gradient Orange-Rose (Changement, Dynamisme).

---

## 🛠️ Stack Technique & Architecture

### Core

- **Framework** : [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Langage** : TypeScript
- **Styling** : [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations** : [Framer Motion](https://www.framer.com/motion/)

### Structure Modulaire (`/components`)

Le code a été refactorisé pour une maintenance optimale :

```text
components/
├── landing/           # Sections de la page d'accueil
│   ├── Hero.tsx       # Intègre <CVStackMockup />
│   ├── Features.tsx   # Utilise <FeatureCard />
│   ├── Pricing.tsx    # Tarifs en FCFA
│   └── ...
├── ui/                # Composants Réutilisables (Design System)
│   ├── SectionHeader  # Titres standardisés
│   ├── Button         # Variantes (Primary, Glass, etc.)
│   └── AvatarGroup    # Gestion des avatars utilisateurs
└── shared/            # Composants Globaux (Navbar, Footer)
```

---

## 🚀 Installation

1. **Cloner le projet**

   ```bash
   git clone https://github.com/votre-username/optijob.git
   cd optijob
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Lancer le serveur**

   ```bash
   npm run dev
   ```

---

## 🌍 Adaptation Locale

- **Devise** : Tarification affichée en **FCFA**.
- **Imagerie** : Avatars et modèles adaptés à la diversité.

*© 2026 OptiJob Inc.*
