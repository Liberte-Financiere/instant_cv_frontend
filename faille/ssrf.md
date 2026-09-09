# Faille Critique : SSRF (Server-Side Request Forgery) via Host Header Injection

**Statut :** CORRIGÉ & VALIDÉ  
**Date de résolution définitive :** 09 Septembre 2026  
**Fichier concerné :** `app/api/pdf/generate/route.ts`

---

### Description
Le générateur de PDF utilise le module Puppeteer pour photographier le CV et le convertir en PDF. 
L'URL cible que Chrome doit visiter était construite en utilisant le header HTTP `Host` fourni par le client (`req.headers.get('host')`).
Un attaquant pouvait modifier ce header pour forcer le serveur à naviguer sur une autre adresse (comme un réseau interne, un localhost ou les métadonnées AWS) tout en lui transmettant le cookie secret `headless_token` contenant `INTERNAL_API_KEY`.

---

### Preuve de Concept (POC Bloqué)
Via Burp Suite ou curl, envoyer la requête suivante :
```http
POST /api/pdf/generate HTTP/1.1
Host: example.com
Cookie: authjs.session-token=VOTRE_TOKEN
Content-Type: application/json

{"id": "cuid-du-cv", "type": "cv"}
```

**Résultat actuel (Sécurisé) :** Le header `Host` est totalement ignoré. Le navigateur Chrome interne navigue exclusivement sur le domaine officiel du serveur (`https://jobsira.com` en production ou `http://localhost:3000` en développement local).

---

### Correctif Appliqué
Ne jamais faire confiance au header `Host`. Utiliser systématiquement les variables d'environnement du serveur et encoder l'identifiant.

```typescript
// AVANT (Vulnérable)
let host = req.headers.get('host') || process.env.NEXT_PUBLIC_APP_URL || 'localhost:3000';
const baseUrl = `${protocol}://${host}`;
const targetUrl = `${baseUrl}/${pagePath}/${id}?print=true&headless=true`;

// APRÈS (Sécurisé)
const isDev = process.env.NODE_ENV === 'development';
const rawAppUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || (isDev ? 'http://localhost:3000' : 'https://jobsira.com');
let baseUrl: string;
try {
  baseUrl = new URL(rawAppUrl.startsWith('http') ? rawAppUrl : `https://${rawAppUrl}`).origin;
} catch {
  baseUrl = isDev ? 'http://localhost:3000' : 'https://jobsira.com';
}

const targetUrl = `${baseUrl}/${pagePath}/${encodeURIComponent(id)}?print=true&headless=true`;
```

