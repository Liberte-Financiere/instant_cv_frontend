# 📏 Règles de Développement & Standards - Instant CV

Ce document recense les règles d'or à respecter pour maintenir la qualité, la sécurité et la performance du projet **Instant CV**.

Tout nouveau développeur doit lire et appliquer ces directives.

---

## 1. 🛡️ TypeScript & Typage (Non Négociable)

*   **Zéro `any`** : L'utilisation de `any` est **strictement interdite**. Si vous ne connaissez pas le type, cherchez-le ou créez-le.
*   **Validation Zod** : Toutes les données entrant ou sortant de l'API doivent être validées via les schémas définis dans `lib/schemas.ts`.
*   **Extension Prisma** : Ne jamais caster manuellement le contenu JSON (`as any`). Le client Prisma est étendu pour retourner automatiquement des objets typés `CV`.

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

## 2. ⚡ Performance Frontend

*   **Images Next.js** : Ne **JAMAIS** utiliser la balise HTML `<img>` standard. Utilisez toujours le composant `<Image />` de Next.js pour bénéficier du lazy loading et du format WebP.
    ```tsx
    // ❌ MAUVAIS
    <img src="/photo.jpg" alt="Photo" />

    // ✅ BON
    <Image src="/photo.jpg" alt="Photo" width={100} height={100} />
    ```
*   **Polices** : Utilisez toujours `next/font` (configuré dans `app/layout.tsx` avec `Manrope`). N'importez pas de polices via CSS ou Google Fonts CDN.

---

## 3. 🔒 Sécurité

*   **Input Validation** : Ne faites jamais confiance au client. Validez tout côté serveur.
*   **Headers** : Les en-têtes de sécurité (CSP, X-Frame-Options) sont configurés dans `next.config.ts`. Ne les désactivez pas sans une excellente raison validée par le lead.
*   **Auth** : Vérifiez toujours la session (`await auth()`) au début de chaque Server Action ou Route Handler.

---

## 4. 🧹 Bonnes Pratiques & Review

*   **Relire deux fois** : Avant de commit, relisez votre code. Supprimez les `console.log` de debug.
*   **Monitoring** : En cas de doute sur une erreur possible, utilisez `Sentry.captureException(error)`.
*   **Linting** : Le code ne doit produire aucun warning ESLint au build.

> *"Un code propre est un code qui se lit comme de la prose."*

---

**Dernière mise à jour :** 06 Février 2026
