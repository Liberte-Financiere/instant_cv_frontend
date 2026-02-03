# OptiJob 🚀

**OptiJob** est votre coach carrière personnel alimenté par l'IA, conçu spécifiquement pour le marché africain et international.
Notre plateforme analyse votre profil, optimise votre CV pour les ATS (Applicant Tracking Systems) et génère des lettres de motivation persuasives en quelques secondes.

---

## ✨ Fonctionnalités & Design (v2.0)

### 🎨 Expérience Visuelle "Deep Blue"

- **Thème Premium** : Esthétique soignée (`#0F172A`) avec typographie **Manrope**.
- **Hero Section** : Animation "Stacked CVs" (cartes superposées) et avatars **profils africains** pour l'ancrage local.
- **Micro-interactions** : Effets de survol, animations au scroll (Framer Motion).

### ⚡ Bento Grid (Fonctionnalités)

Une grille modulaire présentant les 6 piliers de l'application :

1. **Coach IA & Anti-Rejet** : Analyse ATS intelligente.
2. **Ciblage de Poste** : Adaptation aux mots-clés des offres.
3. **Lettre de Motivation** : Rédaction automatique.
4. **Mode Ultra Rapide** : Import LinkedIn/PDF en < 2 min.
5. **Export PDF HD** : Rendu vectoriel pro.
6. **Templates** : Galerie de modèles modernes.

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
