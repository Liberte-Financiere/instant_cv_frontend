# InstantCV 🚀

**InstantCV** est votre éditeur de CV professionnel alimenté par l'IA, conçu pour le marché africain et international.
Créez, personnalisez et partagez votre CV en quelques clics.

---

## ✨ Fonctionnalités

### 🤖 Assistant IA (Nouveau)
- **Correction & Amélioration** de texte automatique.
- **Génération de contenu** (bullet points) à partir d'un titre.
- **Traduction** instantanée FR/EN.
- *Propulsé par Google Gemini.*

### 🎨 Éditeur de CV
[Voir la liste complètes des fonctionnalités](./FEATURES.md)

- **7 Templates Professionnels** :
  - Moderne (sidebar sombre)
  - Classique Épuré
  - Exécutif (serif)
  - Créatif (accents audacieux)
  - Tech Expert (style terminal)
  - **Minimaliste** (ultra-épuré)
  - **Compatible ATS** (optimisé pour robots recruteurs)

- **Personnalisation** :
  - Couleur d'accent personnalisable
  - Photo de profil avec drag & drop
  - **Réorganisation des sections** (glisser-déposer)
  - Prévisualisation en temps réel

### 📤 Export & Partage

- **Export PDF** via boîte de dialogue d'impression
- **Export Word** (.docx) éditable
- **Partage par lien** : page publique `/cv/[id]`

### 📝 Sections CV

- Informations personnelles + photo
- Réseaux sociaux (LinkedIn, GitHub, etc.)
- Profil professionnel
- Expériences
- Formations
- Compétences
- Langues
- Certifications
- Projets
- Références
- Informations complémentaires
- Pied de page personnalisé

---

## 🛠️ Stack Technique

- **Framework** : [Next.js 15](https://nextjs.org/) (App Router)
- **Langage** : TypeScript
- **Styling** : [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations** : [Framer Motion](https://www.framer.com/motion/)
- **State** : [Zustand](https://zustand-demo.pmnd.rs/)
- **Export** : docx, file-saver

### Structure

```text
components/
├── templates/         # Templates CV (7 modèles)
├── cv-sections/       # Composants modulaires (CVExperience, CVEducation...)
├── editor/            # Éditeur (FormSection, CVPreview, ColorPicker, ShareButton)
├── dashboard/         # Sélecteur de templates
└── ui/                # Composants réutilisables
```

---

## 🚀 Installation

```bash
# Cloner le projet
git clone https://github.com/votre-username/instant-cv.git
cd instant-cv

# Installer les dépendances
npm install

# Lancer le serveur
npm run dev
```

---

## 📖 Utilisation

1. **Créer un CV** : Cliquez sur "Créer mon CV"
2. **Choisir un template** : Sélectionnez parmi 7 modèles
3. **Remplir les informations** : Utilisez les accordéons pour chaque section
4. **Personnaliser** : Changez la couleur d'accent, ajoutez une photo
5. **Exporter** : PDF ou Word
6. **Partager** : Générez un lien public

---

*© 2026 InstantCV - Créé avec ❤️*
