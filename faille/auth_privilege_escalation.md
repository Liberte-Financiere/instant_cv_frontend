# Faille Critique : Escalade de Privilèges via NextAuth (Mass Assignment)

**Statut :** CORRIGÉ & VALIDÉ  
**Date de résolution définitive :** 09 Septembre 2026  
**Fichiers concernés :** 
1. `auth.config.ts` (Backend - Suppression de l'assignation non sécurisée)
2. `app/recruiter/pending/page.tsx` & `app/recruiter/rejected/page.tsx` (Frontend - Reconnexion requise pour actualiser la session)
3. `__tests__/auth/auth.config.test.ts` (Test de non-régression automatisé)

---

### Description de la vulnérabilité
Dans la configuration de NextAuth (`auth.config.ts`), la fonction de callback `jwt` est conçue pour gérer les événements de mise à jour (`trigger === "update"`). 
Le code faisait confiance aux données envoyées par le client (`session.role`, `session.recruiterStatus`) et les écrivait directement dans le jeton JWT sécurisé (`token.role = session.role`).

**L'Exploitation :** Puisque le corps de la requête vers `/api/auth/session` provient du navigateur, un utilisateur standard pouvait envoyer un payload `{ recruiterStatus: 'NONE', role: 'ADMIN' }`. NextAuth écrasait le rôle du token par `ADMIN`, accordant les pleins pouvoirs administratifs sur le système sans vérification préalable.

---

### Historique des Interventions

1. **17 Août 2026** : Première identification et suppression de `token.role = session.role`.
2. **08 Septembre 2026** : Régression réintroduite par mégarde lors de l'implémentation de la vérification recruteur (`if (trigger === "update" && session?.recruiterStatus) { if (session.role) token.role = session.role; }`).
3. **09 Septembre 2026 (Résolution Définitive)** : 
   - Suppression intégrale et définitive de l'acceptation de `role` ou `recruiterStatus` dans `jwt()`.
   - Adoption du principe Zero-Trust : le client n'a aucun pouvoir d'élévation ou de modification de statut de session.
   - Forçage d'une reconnexion propre (`signOut`) lors de l'approbation d'un recruteur pour que la base de données PostgreSQL soit la seule source de vérité lors de la réémission du JWT.
   - Test de non-régression automatisé dans `__tests__/auth/auth.config.test.ts`.

---

### Preuve de Concept (POC Bloqué)
Depuis un compte standard :

```http
POST /api/auth/session HTTP/1.1
Host: jobsira.com
Content-Type: application/json

{
  "data": {
    "recruiterStatus": "NONE",
    "role": "ADMIN"
  }
}
```

**Résultat actuel (Sécurisé) :** Le payload est totalement ignoré. Le token conserve strictement son rôle initial (`USER`) et son statut attribué en base (`NONE`).

---

### Architecture Finale Appliquée

**Dans `auth.config.ts` :**
Le callback `jwt` ne contient plus aucune logique de mise à jour pour `role` ou `recruiterStatus` :
```typescript
// Seules les actions cryptographiquement signées par le serveur (ex: impersonation JWT) sont autorisées.
// Aucun attribut de privilège n'est accepté directement depuis le payload client.
```

**Dans les interfaces recruteur (`app/recruiter/pending/page.tsx`) :**
```typescript
if (json.status === 'APPROVED' || json.role === 'RECRUITER') {
  // Reconnexion forcée pour réémettre un token officiel depuis la DB
  await signOut({ callbackUrl: '/login?callbackUrl=/recruiter&message=recruiter_approved' });
}
```

