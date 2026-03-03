# 📏 Règles de Développement & Standards — JobSira

Ce document recense les règles à respecter pour maintenir la qualité, la sécurité et la performance du projet **JobSira**.

Tout nouveau développeur doit lire et appliquer ces directives.

---

## 1. 🏷️ Branding

* **Nom de l'application** : `JobSira` — Ne pas utiliser les anciens noms (InstantCV, OptiJob).
* **Configuration centralisée** : Toutes les informations de branding sont dans `lib/config.ts` (`APP_CONFIG`). Toujours y référer pour le nom, tagline, emails, URL.
* **Rebranding** : Si le nom doit changer, modifier uniquement `lib/config.ts`.

---

## 2. 🛡️ TypeScript & Typage (Non Négociable)

* [ ] **Zéro `any`** : L'utilisation de `any` est **strictement interdite**. Si vous ne connaissez pas le type, cherchez-le ou créez-le.
* [ ] **Validation Zod** : Toutes les données entrant ou sortant de l'API doivent être validées via les schémas définis dans `lib/schemas.ts`.
* [ ] **Extension Prisma** : Ne jamais caster manuellement le contenu JSON (`as any`). Le client Prisma est étendu pour retourner des objets typés.

```typescript
// ❌ MAUVAIS
const body = await req.json();
const cv = body as any;

// ✅ BON
const body = await req.json();
const result = cvSchema.safeParse(body);
if (!result.success) throw new Error("Invalid Data");
```

---

## 3. ⚡ Performance Frontend

* **Images Next.js** : Ne **JAMAIS** utiliser `<img>`. Toujours utiliser `<Image />` de Next.js.
* **Polices** : Utiliser `next/font` uniquement (configuré avec `Manrope` dans `app/layout.tsx`).
* **Hooks React** : Ne **JAMAIS** appeler un hook conditionnellement (dans un ternaire, un `if`, etc.). Extraire les appels Zustand en variables au-dessus du `return`.

```tsx
// ❌ MAUVAIS — hook conditionnel
{useStore(s => s.loading) ? '...' : useStore(s => s.data)}

// ✅ BON — variables extraites
const loading = useStore(s => s.loading);
const data = useStore(s => s.data);
// ...
{loading ? '...' : data}
```

---

## 4. 🔒 Sécurité

* **Input Validation** : Ne faites jamais confiance au client. Validez tout côté serveur avec Zod.
* **Headers** : Les en-têtes de sécurité (CSP, HSTS, X-Frame-Options) sont dans `next.config.ts`. Ne pas les désactiver.
* **Auth** : Vérifier la session (`await auth()`) au début de chaque Route Handler.
* **Rate Limiting** : Utiliser `lib/rate-limit.ts` sur toutes les routes IA pour protéger contre le spam.
* **Rôles** : Les rôles `USER` et `ADMIN` sont définis dans le schema Prisma. Vérifier le rôle pour les routes admin.

---

## 5. 💰 Système de Crédits

* **Vérification avant action** : Tout appel IA doit vérifier que l'utilisateur a assez de crédits **avant** d'appeler l'API Gemini.
* **Déduction atomique** : Utiliser `prisma.user.update({ credits: { decrement: X } })` dans une transaction.
* **Store Zustand** : Le `useCreditStore` gère le state client. Le mettre à jour après chaque appel API.

---

## 6. 🧹 Bonnes Pratiques

* **Pas de `console.log`** en production : Utiliser Sentry pour le monitoring (`Sentry.captureException`).
* **Linting** : Le code ne doit produire aucun warning ESLint au build.
* **Contenu honnête** : Les témoignages, descriptions de features et textes marketing doivent être **véridiques**. Pas de faux noms, pas de promesses non vérifiées.

> *"Un code propre est un code qui se lit comme de la prose."*

---

**Dernière mise à jour :** 22 Février 2026
