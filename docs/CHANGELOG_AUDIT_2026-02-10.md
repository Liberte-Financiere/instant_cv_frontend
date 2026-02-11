# CHANGELOG — Optimisations & Audit (10 Février 2026)

## 📦 Performance Frontend (1.1)

### Landing Page → Server Component
- **Fichier**: `app/(marketing)/page.tsx`
- Supprimé `'use client'` et `useRef` inutile
- **Impact**: Moins de JS envoyé au navigateur, meilleur LCP/FCP

### useCallback sur les formulaires
- **Fichiers**: `components/editor/forms/ExperienceForm.tsx`, `EducationForm.tsx`
- Memoization des handlers pour éviter les re-renders inutiles

### Templates CV
- Déjà optimisé avec `next/dynamic` dans `CVPreview.tsx` ✅

### Loading States (loading.tsx)
8 skeletons créés pour améliorer l'UX pendant le chargement :
| Route | Fichier |
|---|---|
| Dashboard | `app/dashboard/loading.tsx` |
| Éditeur CV | `app/editor/[id]/loading.tsx` |
| Analyse | `app/analysis/loading.tsx` |
| Lettre de motivation | `app/cover-letter/[id]/loading.tsx` |
| Éditeur lettre | `app/cover-letter/editor/[id]/loading.tsx` |
| Preview CV | `app/cv/[id]/loading.tsx` |
| Partage | `app/share/[id]/loading.tsx` |
| Templates | `app/templates/loading.tsx` |

---

## 🔒 Sécurité

### Rate Limiting (NOUVEAU)
- **Fichier créé**: `lib/rate-limit.ts`
- Limiteur en mémoire avec fenêtre glissante et nettoyage automatique
- **Intégré dans 6 routes API** :

| Route | Limite |
|---|---|
| `/api/ai/analyze` | 5 req/min |
| `/api/ai/optimize` | 10 req/min |
| `/api/ai/cover-letter/generate` | 10 req/min |
| `/api/ai/cover-letter/refine` | 10 req/min |
| `/api/upload` | 15 req/min |
| `/api/import/linkedin` | 5 req/min |

### Auth manquant corrigé
- **Fichier**: `app/api/ai/optimize/route.ts`
- Route était accessible **sans authentification** → ajouté `auth()` check

### Headers de sécurité (`next.config.ts`)
- ✅ **HSTS** ajouté: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- ✅ **poweredByHeader**: désactivé (masque X-Powered-By: Next.js)
- ✅ **CSP durci**: supprimé `unsafe-eval` de `script-src`, ajouté Sentry à `connect-src`

### Validation Upload (`app/api/upload/route.ts`)

- Ajouté validation du type de fichier côté serveur (JPEG, PNG, WebP, GIF uniquement)
- Ajouté limite de taille : 5 Mo maximum
- Empêche l'upload de fichiers malveillants vers Cloudinary

---

## 📊 Monitoring

### Sentry — Réduction du sampling
- **Fichiers**: `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`
- `tracesSampleRate`: `1` → `0.1` (réduit les coûts de 90%)

---

## 🔍 SEO

### Sitemap corrigé (`app/sitemap.ts`)
- Supprimé `/dashboard` (route protégée, ne devrait pas être indexée)
- Ajouté `/templates` (priority: 0.7) et `/terms` (priority: 0.3)

---

## ♿ Accessibilité

### Skip Navigation (`app/layout.tsx`)
- Ajouté un lien "Aller au contenu principal" visible uniquement au focus clavier
- Ajouté `<main id="main-content">` wrapper pour la navigation par landmark

---

## 🧹 Nettoyage

### Console.log supprimés
- **13 `console.log`** supprimés dans les fichiers de production :
  - `app/analysis/page.tsx`
  - `app/api/ai/analyze/route.ts` (5 occurrences)
  - `app/api/ai/cover-letter/generate/route.ts` (2 occurrences)
  - `app/api/import/linkedin/route.ts` (2 occurrences)
  - `lib/linkedin-scraper.ts` (2 occurrences)
  - `hooks/useProcessReferral.ts` (1 occurrence)
- Les `console.error` sont conservés (capturés par Sentry)
- 3 `console.log` commentés dans `lib/storage.ts` — inoffensifs

---

## 🎨 Tailwind CSS — Migration des couleurs

### Couleurs hardcodées → Variables thème

- **`globals.css`** : ajouté 4 variables thème (`bg-dark`, `bg-light`, `linkedin`, `linkedin-dark`)
- **~20 fichiers migrés** : `#0F172A` → `bg-bg-dark`, `#2463eb` → `bg-primary`, `#0077B5` → `bg-linkedin`
- **Composants UI** : `Button`, `Input`, `Textarea`, `Select`, `AvatarGroup`, `SectionHeader`
- **Navigation** : `Navbar`, `Sidebar`, `MobileHeader`
- **Landing** : `Hero`, `CallToAction`, `Pricing`, `TargetAudience`, `Features`, `FeatureCard`, `CVStackMockup`, `FAQ`
- **Pages** : `layout.tsx`, `auth/page.tsx`, `dashboard/page.tsx`, `editor/[id]/page.tsx`
- **Impact** : Changement de couleur centralisé, meilleure maintenabilité

---

## ♿ Accessibilité (étendue)

### Focus-visible global

- **`globals.css`** : ajouté `*:focus-visible` avec outline bleu primaire pour navigation clavier
- Conforme WCAG 2.1 — visible sur tous les éléments interactifs

### Contraste amélioré

- **`globals.css`** : `text-slate-400` redirigé vers `#64748b` (slate-500) pour ratio ≥ 4.5:1 WCAG

