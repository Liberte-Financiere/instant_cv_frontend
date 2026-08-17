# Faille Critique : SSRF (Server-Side Request Forgery) via Host Header Injection

**Fichier concerné :** `app/api/pdf/generate/route.ts`

### Description
Le générateur de PDF utilise le module Puppeteer pour photographier le CV et le convertir en PDF. 
L'URL cible que Chrome doit visiter est construite en utilisant le header HTTP `Host` fourni par le client (`req.headers.get('host')`).
Un attaquant peut modifier ce header pour forcer le serveur à naviguer sur une autre adresse (comme un réseau interne, un localhost ou les métadonnées AWS).

### Preuve de Concept (POC)
Via Burp Suite, envoyer la requête suivante :
```http
POST /api/pdf/generate HTTP/1.1
Host: example.com
Cookie: authjs.session-token=VOTRE_TOKEN
Content-Type: application/json

{"id": "nimporte-quel-id", "type": "cv"}
```
**Résultat :** Le PDF généré contient la page d'erreur de `example.com` au lieu du CV, prouvant que le navigateur interne du serveur a été manipulé.

### Correctif
Ne jamais faire confiance au header `Host`. Utiliser systématiquement la variable d'environnement du serveur.
```typescript
// AVANT (Vulnérable)
let host = req.headers.get('host') || process.env.NEXT_PUBLIC_APP_URL || 'localhost:3000';

// APRÈS (Sécurisé)
const host = process.env.NEXT_PUBLIC_APP_URL || 'localhost:3000';
```
