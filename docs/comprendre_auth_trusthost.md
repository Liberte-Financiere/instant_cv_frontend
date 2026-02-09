# 🔐 Comprendre Auth.js et le Problème "UntrustedHost"

> Guide expliqué simplement, comme si tu n'avais jamais programmé.

---

## 📖 Table des Matières

1. [C'est quoi l'authentification ?](#1-cest-quoi-lauthentification-)
2. [Le problème de confiance](#2-le-problème-de-confiance)
3. [Comment Auth.js protège ton app](#3-comment-authjs-protège-ton-app)
4. [Pourquoi 2 fichiers de config ?](#4-pourquoi-2-fichiers-de-config-)
5. [Les 2 solutions possibles](#5-les-2-solutions-possibles)
6. [Schéma récapitulatif](#6-schéma-récapitulatif)

---

## 1. C'est quoi l'authentification ?

### Analogie : Le videur de boîte de nuit 🕺

Imagine une boîte de nuit exclusive :

- **Toi** = L'utilisateur qui veut entrer
- **Le videur** = Le système d'authentification (Auth.js)
- **La boîte de nuit** = Ton application (dashboard, pages protégées)
- **Le bracelet VIP** = Ta session/token de connexion

Quand tu te connectes avec Google :
1. Tu montres ta carte d'identité (compte Google)
2. Le videur (Auth.js) vérifie que c'est bien toi
3. Il te donne un bracelet VIP (session)
4. À chaque porte de la boîte, on vérifie ton bracelet

---

## 2. Le Problème de Confiance

### Analogie : L'arnaque du faux videur 🎭

Imagine qu'un escroc ouvre une **fausse boîte de nuit** qui ressemble exactement à la vraie :

```
VRAIE BOÎTE                    FAUSSE BOÎTE (arnaque)
┌─────────────┐                ┌─────────────┐
│   🏢 ClubVIP │                │   🏢 ClubVIP │  ← Même nom !
│             │                │             │
│  Adresse:   │                │  Adresse:   │
│  123 Rue A  │                │  456 Rue B  │  ← Différente
└─────────────┘                └─────────────┘
```

Si le vrai videur accepte les demandes venant de **n'importe quelle adresse**, l'arnaqueur peut :
1. Créer un faux site qui ressemble au tien
2. Envoyer des requêtes au vrai videur
3. Voler les informations de connexion des utilisateurs

### C'est ça une attaque "Host Header Injection" !

Pour se protéger, le videur (Auth.js) vérifie l'**adresse d'origine** de chaque requête :

> "Hey, cette requête vient de `instant-cv-frontend.onrender.com`... Est-ce une adresse que je connais et en qui j'ai confiance ?"

---

## 3. Comment Auth.js Protège ton App

### Le système de "liste de confiance"

Auth.js a une **liste de domaines autorisés** (comme une liste VIP) :

```
LISTE DE CONFIANCE PAR DÉFAUT :
┌─────────────────────────────┐
│ ✅ localhost                │  ← Automatiquement OK
│ ✅ localhost:3000           │  ← Automatiquement OK
│                             │
│ ❌ instant-cv-frontend...   │  ← PAS dans la liste !
│ ❌ monsite.vercel.app       │  ← PAS dans la liste !
│ ❌ exemple.com              │  ← PAS dans la liste !
└─────────────────────────────┘
```

### Pourquoi localhost est automatiquement OK ?

En développement (sur ton ordi), tu travailles sur `localhost`. Auth.js sait que c'est sûr car personne d'autre n'a accès à ton ordinateur.

Mais en **production** (sur internet), ton domaine Render n'est pas reconnu automatiquement.

---

## 4. Pourquoi 2 Fichiers de Config ?

### Les 2 "environnements" de ton serveur

Ton app Next.js a **deux types de serveurs** qui tournent :

```
┌──────────────────────────────────────────────────────────────────┐
│                        TON APP NEXT.JS                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌─────────────────────────┐    ┌─────────────────────────────┐ │
│   │    EDGE RUNTIME         │    │    NODE.JS RUNTIME          │ │
│   │    (Serveurs légers)    │    │    (Serveur principal)      │ │
│   │                         │    │                             │ │
│   │  📍 Distribué mondiale- │    │  🏢 Un seul serveur         │ │
│   │     ment (CDN)          │    │     central                 │ │
│   │                         │    │                             │ │
│   │  ⚡ Ultra rapide         │    │  🐢 Plus lent mais puissant │ │
│   │                         │    │                             │ │
│   │  🚫 Limité (pas de      │    │  ✅ Accès complet (Prisma,  │ │
│   │     Prisma, etc.)       │    │     base de données, etc.)  │ │
│   │                         │    │                             │ │
│   │  📄 auth.config.ts      │    │  📄 auth.ts                 │ │
│   └─────────────────────────┘    └─────────────────────────────┘ │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Analogie : Restaurant avec drive et salle

- **Edge** = Le **drive-through** → Rapide, mais menu limité
- **Node.js** = La **salle du restaurant** → Plus lent, mais tout le menu disponible

### Pourquoi séparer ?

Le **middleware** (qui vérifie l'auth à chaque requête) tourne sur **Edge** car :
- Il doit être TRÈS rapide (il s'exécute à chaque requête)
- Il est proche de l'utilisateur géographiquement

Mais Edge **ne peut pas** utiliser Prisma (trop lourd), donc on a besoin de 2 fichiers :

| Fichier | Utilisé par | Contenu |
|---------|-------------|---------|
| `auth.config.ts` | Middleware (Edge) | Config légère sans Prisma |
| `auth.ts` | API Routes (Node.js) | Config complète avec Prisma |

---

## 5. Les 2 Solutions Possibles

### Solution A : Modifier le code (`trustHost: true`)

C'est comme dire au videur : **"Fais confiance à tout le monde"**

```typescript
// auth.config.ts
export const authConfig = {
  trustHost: true,  // ← Ajouter cette ligne
  providers: [...],
  // ...
}
```

**Comment ça marche :**
```
Requête arrive → Auth.js vérifie le code → trustHost: true → ✅ OK !
```

### Solution B : Variable d'environnement (`AUTH_TRUST_HOST=true`)

C'est comme donner au videur une **note écrite** : "Fais confiance à tout le monde"

Sur Render, tu ajoutes :
```
AUTH_TRUST_HOST=true
```

**Comment ça marche :**
```
Requête arrive → Auth.js cherche la note → trouve AUTH_TRUST_HOST=true → ✅ OK !
```

### Pourquoi les 2 marchent ?

Auth.js a ce code interne (simplifié) :

```javascript
// Pseudo-code interne d'Auth.js
function estDomaineDeTrust(domaine) {
  // D'abord, vérifier le code
  if (config.trustHost === true) {
    return true  // ✅ Faire confiance
  }
  
  // Ensuite, vérifier la variable d'environnement
  if (process.env.AUTH_TRUST_HOST === "true") {
    return true  // ✅ Faire confiance
  }
  
  // Sinon, vérifier si c'est localhost
  if (domaine === "localhost") {
    return true  // ✅ Faire confiance
  }
  
  // Aucune condition remplie
  return false  // ❌ Rejeter !
}
```

C'est un **OU** logique : si l'une ou l'autre condition est vraie, ça passe.

---

## 6. Schéma Récapitulatif

### Le flux complet d'une requête

```
UTILISATEUR VISITE: instant-cv-frontend.onrender.com/dashboard
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  ÉTAPE 1 : LE MIDDLEWARE (Edge)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Le middleware intercepte TOUTES les requêtes.                  │
│  Il utilise : auth.config.ts                                    │
│                                                                  │
│  Vérification de confiance :                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Domaine: instant-cv-frontend.onrender.com               │   │
│  │                                                           │   │
│  │  ❓ trustHost dans auth.config.ts ?                      │   │
│  │     → NON (absent)                                        │   │
│  │                                                           │   │
│  │  ❓ Variable AUTH_TRUST_HOST ?                           │   │
│  │     → NON (pas configurée sur Render)                    │   │
│  │                                                           │   │
│  │  ❓ Est-ce localhost ?                                   │   │
│  │     → NON                                                 │   │
│  │                                                           │   │
│  │  RÉSULTAT : ❌ REJETÉ !                                  │   │
│  │  → Erreur "UntrustedHost"                                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    🚫 BLOQUÉ ICI !
                    L'utilisateur voit une erreur.
```

### Après la correction

```
UTILISATEUR VISITE: instant-cv-frontend.onrender.com/dashboard
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  ÉTAPE 1 : LE MIDDLEWARE (Edge)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Vérification de confiance :                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ❓ trustHost dans auth.config.ts ?                      │   │
│  │     → OUI ! (trustHost: true)                            │   │
│  │                                                           │   │
│  │  RÉSULTAT : ✅ AUTORISÉ !                                │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  ÉTAPE 2 : VÉRIFIER LA SESSION                  │
├─────────────────────────────────────────────────────────────────┤
│  L'utilisateur est-il connecté ?                                │
│  - Si OUI → Afficher /dashboard                                 │
│  - Si NON → Rediriger vers /login                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ✅ Page affichée normalement !
```

---

## 🎓 Résumé Final

| Concept | Explication Simple |
|---------|---------------------|
| **Auth.js** | Le videur de ton app qui vérifie les identités |
| **trustHost** | "Fais confiance aux requêtes de ce domaine" |
| **Edge Runtime** | Serveurs rapides et distribués pour le middleware |
| **Node.js Runtime** | Serveur principal avec accès complet |
| **UntrustedHost** | "Je ne reconnais pas ce domaine, je refuse" |
| **La solution** | Dire à Auth.js de faire confiance via code OU variable d'env |

---

## ⚠️ Note de Sécurité

Mettre `trustHost: true` est **sûr** quand :
- ✅ Tu connais ton domaine de production
- ✅ Tu utilises HTTPS
- ✅ C'est une app que TU contrôles

C'est **risqué** si :
- ❌ N'importe qui peut déployer ton code
- ❌ Tu ne contrôles pas le domaine

Dans ton cas (app SaaS sur Render), c'est **totalement sûr** ✅

---

*Document créé pour expliquer l'architecture d'Auth.js et le problème UntrustedHost*
