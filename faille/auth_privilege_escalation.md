# Faille Critique : Escalade de Privilèges via NextAuth (Mass Assignment)

**Fichiers concernés :** 
1. `auth.config.ts` (Backend - Le faille)
2. `app/recruiter/register/page.tsx` (Frontend - L'origine du besoin)

### Description de la vulnérabilité
Dans la configuration de NextAuth (`auth.config.ts`), la fonction de callback `jwt` est conçue pour gérer les mises à jour de session (`trigger === "update"`). 
Le code actuel fait directement confiance aux données envoyées par le client (`session.role`) et les écrit dans le jeton JWT sécurisé (`token.role = session.role`).

**L'origine du problème :** Dans le composant `register/page.tsx`, lorsqu'un utilisateur devient recruteur, le frontend force la mise à jour du cookie en appelant `await update({ role: 'RECRUITER' })`. Pour que cela fonctionne, le développeur a autorisé le backend à accepter aveuglément le rôle fourni dans le payload.

**L'Exploitation :** Puisque la variable `session` provient du navigateur, un utilisateur malveillant peut ouvrir sa console et injecter n'importe quel rôle (comme `ADMIN`). Le serveur signera le nouveau JWT et lui donnera les pleins pouvoirs.

### Preuve de Concept (POC)
Depuis un compte standard, envoyer la requête POST suivante depuis la console du navigateur ou Burp Suite vers `/api/auth/session` :

```http
POST /api/auth/session HTTP/1.1
Host: jobsira.com
Content-Type: application/json

{
  "csrfToken": "VOTRE_CSRF_TOKEN_ACTUEL",
  "data": {
    "role": "ADMIN"
  }
}
```

**Résultat :** Le serveur renvoie un nouveau cookie de session valide avec le rôle `ADMIN`.

### Correctifs Recommandés

**1. Côté Frontend (`app/recruiter/register/page.tsx` ligne 47) :**
Ne pas envoyer de données dans l'update. Dire simplement à NextAuth de rafraîchir.
```tsx
// AVANT : await update({ role: 'RECRUITER' });
// APRÈS :
await update();
```

**2. Côté Backend (`auth.config.ts` Ligne 148) :**
Ne jamais faire confiance au client. Interroger la base de données.
```typescript
// AVANT (Vulnérable) :
if (trigger === "update" && session?.role && !session?.impersonationToken && !session?.stopImpersonation) {
    token.role = session.role;
}

// APRÈS (Sécurisé) :
if (trigger === "update" && !session?.impersonationToken && !session?.stopImpersonation) {
    const { prisma } = require("@/lib/prisma"); 
    try {
        const dbUser = await prisma.user.findUnique({
            where: { id: token.sub as string },
            select: { role: true }
        });
        if (dbUser) {
            token.role = dbUser.role; // Seule la DB fait autorité
        }
    } catch (e) {
        console.error("Erreur lors de l'update de session", e);
    }
}
```
