# 🗄️ Comprendre l'Architecture de la Base de Données

> Guide détaillé sur comment les données sont organisées et stockées dans l'application JobSira.

---

## 📖 Table des Matières

1. [C'est quoi une base de données ?](#1-cest-quoi-une-base-de-données-)
2. [L'architecture globale](#2-larchitecture-globale)
3. [Les tables expliquées](#3-les-tables-expliquées)
4. [Les relations entre tables](#4-les-relations-entre-tables)
5. [Le stockage JSON intelligent](#5-le-stockage-json-intelligent)
6. [Prisma : le traducteur](#6-prisma--le-traducteur)
7. [Schéma visuel complet](#7-schéma-visuel-complet)

---

## 1. C'est quoi une base de données ?

### Analogie : Le classeur géant 📁

Imagine un **énorme classeur de bureau** avec plusieurs tiroirs :

```
┌─────────────────────────────────────────────────────────────┐
│                    BASE DE DONNÉES                          │
│                   (Le classeur géant)                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   📁 Tiroir "Users"      → Tous les utilisateurs           │
│   📁 Tiroir "CVs"        → Tous les CV créés               │
│   📁 Tiroir "Accounts"   → Connexions Google, etc.         │
│   📁 Tiroir "Sessions"   → Qui est connecté maintenant     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

- **Chaque tiroir** = Une **table** dans la base de données
- **Chaque fiche dans le tiroir** = Un **enregistrement** (une ligne)
- **Les colonnes sur la fiche** = Les **champs** (nom, email, etc.)

---

## 2. L'Architecture Globale

### Vue d'ensemble du système

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TON APPLICATION                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────────────────┐   │
│   │  FRONTEND    │────▶│   NEXT.JS    │────▶│   PRISMA (Traducteur)   │   │
│   │  (React)     │     │   (API)      │     │                          │   │
│   └──────────────┘     └──────────────┘     └────────────┬─────────────┘   │
│                                                           │                  │
│                                                           ▼                  │
│                                             ┌──────────────────────────┐    │
│                                             │      POSTGRESQL          │    │
│                                             │   (Base de données)      │    │
│                                             │                          │    │
│                                             │  • Users                 │    │
│                                             │  • CVs                   │    │
│                                             │  • CoverLetters          │    │
│                                             │  • Accounts              │    │
│                                             │  • Sessions              │    │
│                                             └──────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Pourquoi PostgreSQL ?

| Base de données | Type | Utilisation |
|-----------------|------|-------------|
| MySQL | Relationnelle | Sites classiques |
| MongoDB | Document (NoSQL) | Données flexibles |
| **PostgreSQL** ✅ | **Relationnelle + JSON** | **Le meilleur des deux mondes** |
| SQLite | Fichier local | Apps mobiles/desktop |

PostgreSQL est parfait pour JobSira car :
- ✅ Supporte les relations (User → CVs)
- ✅ Supporte le JSON natif (contenu du CV)
- ✅ Très performant
- ✅ Gratuit et open-source

---

## 3. Les Tables Expliquées

### 🔐 Tables d'Authentification (Auth.js)

Ces tables sont gérées automatiquement par Auth.js. Tu n'as pas besoin de les manipuler directement.

#### Table `User` (Les utilisateurs)

> **Analogie** : C'est la fiche d'identité de chaque membre.

```
┌────────────────────────────────────────────────────────────┐
│                        TABLE: User                          │
├──────────────┬───────────────┬──────────────────────────────┤
│    Colonne   │     Type      │        Description           │
├──────────────┼───────────────┼──────────────────────────────┤
│ id           │ String (CUID) │ Identifiant unique           │
│ name         │ String?       │ Nom complet                  │
│ email        │ String?       │ Adresse email (unique)       │
│ emailVerified│ DateTime?     │ Date de vérification         │
│ image        │ String?       │ Photo de profil (URL)        │
└──────────────┴───────────────┴──────────────────────────────┘

Exemple de données :
┌───────────────┬────────────────┬──────────────────────┬─────────────────┐
│      id       │      name      │        email         │      image      │
├───────────────┼────────────────┼──────────────────────┼─────────────────┤
│ clx123abc456  │ Jean Dupont    │ jean@gmail.com       │ googlephoto.jpg │
│ clx789def012  │ Marie Martin   │ marie@outlook.com    │ NULL            │
└───────────────┴────────────────┴──────────────────────┴─────────────────┘
```

**Ce que signifie `?`** : Le champ est **optionnel** (peut être vide/NULL).

---

#### Table `Account` (Les connexions OAuth)

> **Analogie** : C'est la liste des "clés" que l'utilisateur utilise pour entrer (Google, GitHub, etc.).

```
┌────────────────────────────────────────────────────────────┐
│                      TABLE: Account                         │
├──────────────────┬───────────────┬──────────────────────────┤
│      Colonne     │     Type      │      Description         │
├──────────────────┼───────────────┼──────────────────────────┤
│ id               │ String        │ Identifiant unique       │
│ userId           │ String        │ → Lien vers User         │
│ type             │ String        │ "oauth" généralement     │
│ provider         │ String        │ "google", "github", etc. │
│ providerAccountId│ String        │ ID chez Google/GitHub    │
│ access_token     │ String?       │ Token d'accès            │
│ refresh_token    │ String?       │ Token de renouvellement  │
│ expires_at       │ Int?          │ Date d'expiration        │
└──────────────────┴───────────────┴──────────────────────────┘
```

**Pourquoi cette table ?**

Un même utilisateur peut se connecter avec **plusieurs méthodes** :
- Connexion avec Google
- Connexion avec GitHub
- Connexion avec email/mot de passe

Chaque méthode = 1 ligne dans `Account`, mais toutes pointent vers le même `User`.

```
USER: Jean Dupont (id: clx123)
   │
   ├── Account: Google   (providerAccountId: "google-12345")
   │
   └── Account: GitHub   (providerAccountId: "github-67890")
```

---

#### Table `Session` (Les sessions actives)

> **Analogie** : C'est le "bracelet VIP" temporaire donné quand quelqu'un se connecte.

```
┌────────────────────────────────────────────────────────────┐
│                      TABLE: Session                         │
├──────────────┬───────────────┬──────────────────────────────┤
│    Colonne   │     Type      │        Description           │
├──────────────┼───────────────┼──────────────────────────────┤
│ id           │ String        │ Identifiant unique           │
│ sessionToken │ String        │ Le "code secret" du bracelet │
│ userId       │ String        │ → Lien vers User             │
│ expires      │ DateTime      │ Quand le bracelet expire     │
└──────────────┴───────────────┴──────────────────────────────┘
```

**Comment ça marche ?**

1. Jean se connecte avec Google
2. Auth.js crée une nouvelle `Session` avec un `sessionToken` unique
3. Ce token est stocké dans un cookie du navigateur
4. À chaque requête, le serveur vérifie : "Ce token existe-t-il dans la table Session ?"
5. Quand `expires` est passé, la session n'est plus valide

---

#### Table `VerificationToken` (Tokens de vérification)

> **Analogie** : C'est le "code à usage unique" envoyé par email pour vérifier ton identité.

```
┌────────────────────────────────────────────────────────────┐
│                  TABLE: VerificationToken                   │
├──────────────┬───────────────┬──────────────────────────────┤
│    Colonne   │     Type      │        Description           │
├──────────────┼───────────────┼──────────────────────────────┤
│ identifier   │ String        │ L'email de l'utilisateur     │
│ token        │ String        │ Le code secret               │
│ expires      │ DateTime      │ Quand le code expire         │
└──────────────┴───────────────┴──────────────────────────────┘
```

Utilisé pour les "Magic Links" (connexion par email sans mot de passe).

---

### 📄 Tables Métier (Ton application)

Ces tables contiennent les données spécifiques à JobSira.

#### Table `CV` (Les CV créés)

> **Analogie** : C'est le dossier qui contient chaque CV créé par les utilisateurs.

```
┌────────────────────────────────────────────────────────────┐
│                        TABLE: CV                            │
├──────────────┬───────────────┬──────────────────────────────┤
│    Colonne   │     Type      │        Description           │
├──────────────┼───────────────┼──────────────────────────────┤
│ id           │ String        │ Identifiant unique           │
│ title        │ String        │ Nom du CV ("Mon CV Tech")    │
│ content      │ JSON          │ 🔥 Tout le contenu du CV     │
│ isPublic     │ Boolean       │ Visible publiquement ?       │
│ views        │ Int           │ Nombre de vues               │
│ createdAt    │ DateTime      │ Date de création             │
│ updatedAt    │ DateTime      │ Dernière modification        │
│ userId       │ String?       │ → Lien vers User (optionnel) │
└──────────────┴───────────────┴──────────────────────────────┘
```

**Pourquoi `userId` est optionnel (`?`) ?**

Pour permettre la création de CV **sans compte** (mode invité/preview).

---

#### Table `CoverLetter` (Les lettres de motivation)

```
┌────────────────────────────────────────────────────────────┐
│                    TABLE: CoverLetter                       │
├──────────────┬───────────────┬──────────────────────────────┤
│    Colonne   │     Type      │        Description           │
├──────────────┼───────────────┼──────────────────────────────┤
│ id           │ String        │ Identifiant unique           │
│ title        │ String        │ Nom de la lettre             │
│ content      │ JSON          │ Contenu de la lettre         │
│ createdAt    │ DateTime      │ Date de création             │
│ updatedAt    │ DateTime      │ Dernière modification        │
│ userId       │ String        │ → Lien vers User (obligatoire)│
└──────────────┴───────────────┴──────────────────────────────┘
```

---

## 4. Les Relations entre Tables

### Qu'est-ce qu'une relation ?

> **Analogie** : C'est comme les liens de parenté dans une famille.

Dans une base de données relationnelle, les tables sont **connectées** entre elles :

```
                        ┌─────────────────┐
                        │      USER       │
                        │    (Parent)     │
                        └────────┬────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
         ▼                       ▼                       ▼
   ┌──────────┐           ┌──────────┐           ┌──────────────┐
   │ Account  │           │    CV    │           │ CoverLetter  │
   │ (Enfant) │           │ (Enfant) │           │   (Enfant)   │
   └──────────┘           └──────────┘           └──────────────┘
```

### Types de relations

#### 1. Un-à-Plusieurs (1:N)

> Un utilisateur peut avoir PLUSIEURS CV, mais chaque CV n'appartient qu'à UN utilisateur.

```
USER (Jean)
    │
    ├── CV: "Mon CV Développeur"
    ├── CV: "Mon CV Designer"
    └── CV: "Mon CV Data Scientist"
```

**Dans le code Prisma :**

```prisma
model User {
  id   String @id
  cvs  CV[]    // ← Un tableau (plusieurs CV)
}

model CV {
  id     String @id
  userId String
  user   User   @relation(fields: [userId], references: [id])
  // ← userId pointe vers l'id de User
}
```

#### 2. Suppression en Cascade

> **Analogie** : Si tu supprimes le tronc de l'arbre, toutes les branches tombent.

```prisma
model CV {
  user User @relation(
    fields: [userId], 
    references: [id], 
    onDelete: Cascade  // ← Si User supprimé, tous ses CV sont supprimés
  )
}
```

**Pourquoi ?**

Si Jean supprime son compte, on ne veut pas garder ses CV orphelins dans la base.

---

## 5. Le Stockage JSON Intelligent

### Le problème des CV classiques

Si on stockait chaque information dans une colonne séparée :

```
TABLE CV (mauvaise approche) :
┌──────┬──────────────┬────────────┬─────────────┬───────────────┬─────────────┐
│  id  │ first_name   │ last_name  │ experience1 │ experience2   │ skill1      │
├──────┼──────────────┼────────────┼─────────────┼───────────────┼─────────────┤
│  1   │ Jean         │ Dupont     │ Google      │ Facebook      │ JavaScript  │
│  2   │ Marie        │ Martin     │ Apple       │ NULL          │ Python      │
└──────┴──────────────┴────────────┴─────────────┴───────────────┴─────────────┘

Problèmes :
❌ Combien de colonnes pour les expériences ? 5 ? 10 ? 100 ?
❌ Que faire si quelqu'un a 15 compétences ?
❌ La structure est rigide et difficile à changer
```

### La solution : Le JSON !

> **Analogie** : Au lieu de cases fixes, on utilise un sac extensible.

```
TABLE CV (bonne approche avec JSON) :
┌──────┬─────────────────────────────────────────────────────────────────────┐
│  id  │                            content (JSON)                           │
├──────┼─────────────────────────────────────────────────────────────────────┤
│  1   │ { "personalInfo": {"firstName": "Jean"}, "experiences": [...] }     │
│  2   │ { "personalInfo": {"firstName": "Marie"}, "skills": [...] }         │
└──────┴─────────────────────────────────────────────────────────────────────┘
```

### Structure complète du JSON (content)

```json
{
  "id": "cv_abc123",
  "title": "Mon CV Développeur",
  "templateId": "modern",
  
  "personalInfo": {
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean@example.com",
    "phone": "+33 6 12 34 56 78",
    "address": "Paris, France",
    "title": "Développeur Full Stack",
    "summary": "Passionné par le code..."
  },
  
  "experiences": [
    {
      "id": "exp1",
      "company": "Google",
      "position": "Software Engineer",
      "startDate": "2020-01",
      "endDate": "2023-06",
      "current": false,
      "description": "Développement de..."
    },
    {
      "id": "exp2",
      "company": "Startup XYZ",
      "position": "Lead Developer",
      "startDate": "2023-07",
      "current": true,
      "description": "..."
    }
  ],
  
  "education": [...],
  "skills": [...],
  "languages": [...],
  "projects": [...],
  "certifications": [...],
  "references": [...],
  
  "settings": {
    "accentColor": "#3B82F6",
    "fontFamily": "sans"
  },
  
  "sectionOrder": [
    "summary", "experience", "education", 
    "skills", "projects", "languages"
  ]
}
```

### Avantages du JSON

| Avantage | Explication |
|----------|-------------|
| **Flexible** | Ajouter un champ ne nécessite pas de modifier la table |
| **Illimité** | 100 expériences ? Pas de problème ! |
| **Structuré** | Données imbriquées et organisées |
| **Performant** | PostgreSQL indexe le JSON nativement |

---

## 6. Prisma : Le Traducteur

### C'est quoi Prisma ?

> **Analogie** : C'est un **traducteur** entre ton code JavaScript/TypeScript et la base de données SQL.

```
┌────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   TON CODE                 PRISMA                 BASE DE DONNÉES  │
│   (TypeScript)          (Traducteur)              (PostgreSQL)     │
│                                                                     │
│   prisma.user.       ─────────────▶   SELECT * FROM "User"         │
│     findMany()                        WHERE ...;                   │
│                                                                     │
│   prisma.cv.         ─────────────▶   INSERT INTO "CV"             │
│     create({...})                     VALUES (...);                │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### Comment ça marche ?

#### Étape 1 : Définir le schéma (`schema.prisma`)

```prisma
model User {
  id    String @id @default(cuid())
  name  String?
  email String? @unique
  cvs   CV[]
}

model CV {
  id      String @id @default(cuid())
  title   String
  content Json
  userId  String?
  user    User?  @relation(fields: [userId], references: [id])
}
```

#### Étape 2 : Générer le client

```bash
npx prisma generate
```

Ceci crée des **types TypeScript** automatiques !

#### Étape 3 : Utiliser dans le code

```typescript
// Créer un CV
const cv = await prisma.cv.create({
  data: {
    title: "Mon CV",
    content: { personalInfo: {...}, experiences: [...] },
    userId: "user123"
  }
});

// Récupérer tous les CV d'un utilisateur
const userCVs = await prisma.cv.findMany({
  where: { userId: "user123" }
});

// Récupérer un utilisateur avec ses CV
const userWithCVs = await prisma.user.findUnique({
  where: { id: "user123" },
  include: { cvs: true }  // ← Inclure les CV liés
});
```

### Le Pattern Singleton

Dans ton app (`lib/prisma.ts`), Prisma utilise le **pattern singleton** :

```typescript
// ❌ Mauvais : Crée une nouvelle connexion à chaque import
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// ✅ Bon : Réutilise la même connexion
const globalForPrisma = globalThis as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

> **Analogie** : Au lieu d'ouvrir une nouvelle porte à chaque fois (coûteux), on garde la porte ouverte et on la réutilise.

---

## 7. Schéma Visuel Complet

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ARCHITECTURE BASE DE DONNÉES                          │
│                              INSTANT CV                                       │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │                 │
                              │      USER       │
                              │                 │
                              │  id             │
                              │  name           │
                              │  email          │
                              │  emailVerified  │
                              │  image          │
                              │                 │
                              └────────┬────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        │                              │                              │
        │ 1:N                          │ 1:N                          │ 1:N
        ▼                              ▼                              ▼
┌───────────────┐              ┌───────────────┐              ┌───────────────┐
│               │              │               │              │               │
│    ACCOUNT    │              │      CV       │              │ COVERLETTER   │
│               │              │               │              │               │
│  id           │              │  id           │              │  id           │
│  userId  ────────────────────│  userId  ─────│──────────────│  userId  ─────│
│  provider     │              │  title        │              │  title        │
│  type         │              │  content (JSON)│              │  content (JSON)│
│  access_token │              │  isPublic     │              │  createdAt    │
│  refresh_token│              │  views        │              │  updatedAt    │
│               │              │  createdAt    │              │               │
└───────────────┘              │  updatedAt    │              └───────────────┘
                               │               │
                               └───────────────┘
        │
        │ 1:N
        ▼
┌───────────────┐              ┌───────────────┐
│               │              │               │
│    SESSION    │              │ VERIFICATION  │
│               │              │    TOKEN      │
│  id           │              │               │
│  sessionToken │              │  identifier   │
│  userId  ─────│              │  token        │
│  expires      │              │  expires      │
│               │              │               │
└───────────────┘              └───────────────┘


                        LÉGENDE
                 ─────────────────────
                 1:N = Un-à-Plusieurs
                 ──▶ = Clé étrangère
```

### Flux de données typique

```
1. L'utilisateur se connecte avec Google
   │
   ▼
2. Auth.js crée/récupère l'entrée User
   │
   ├── Crée une entrée Account (provider: "google")
   └── Crée une entrée Session (token dans le cookie)
   │
   ▼
3. L'utilisateur crée un CV
   │
   ▼
4. Next.js API Route reçoit la requête
   │
   ▼
5. Prisma traduit en SQL et envoie à PostgreSQL
   │
   │   prisma.cv.create({
   │     data: {
   │       title: "Mon CV",
   │       content: {...},
   │       userId: session.user.id
   │     }
   │   })
   │
   │   ──▶ INSERT INTO "CV" (id, title, content, userId)
   │       VALUES ('cuid123', 'Mon CV', '{...}', 'user123');
   │
   ▼
6. PostgreSQL stocke les données
   │
   ▼
7. Réponse retournée au frontend
```

---

## 📚 Glossaire

| Terme | Définition Simple |
|-------|-------------------|
| **Table** | Un "tiroir" qui contient des données du même type |
| **Enregistrement/Row** | Une "fiche" dans le tiroir (une ligne) |
| **Colonne/Field** | Une information sur la fiche (nom, email, etc.) |
| **Clé primaire (PK)** | L'identifiant unique de chaque fiche (`id`) |
| **Clé étrangère (FK)** | Un lien vers une autre table (`userId`) |
| **Relation** | Le lien entre deux tables |
| **JSON** | Format flexible pour stocker des données structurées |
| **ORM (Prisma)** | Outil qui traduit le code en requêtes SQL |
| **Migration** | Script qui modifie la structure de la base |
| **Cascade** | Suppression automatique des données liées |

---

## 🎓 Résumé Final

| Composant | Rôle |
|-----------|------|
| **PostgreSQL** | Stocke toutes les données |
| **Prisma** | Traduit TypeScript ↔ SQL |
| **Tables Auth** | Gèrent connexion/sessions |
| **Tables Métier** | Stockent CV et lettres |
| **JSON** | Permet des structures flexibles |
| **Relations** | Lient les données entre elles |

---

*Document créé pour expliquer l'architecture de la base de données JobSira*
