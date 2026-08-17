# Faille Critique : Crédits Infinis via Race Condition (Parrainage)

**Fichier concerné :** `app/api/referral/route.ts`

### Description de la vulnérabilité
Le système de parrainage (Referral) souffre d'une faille de type **Race Condition** (TOC/TOU - Time Of Check to Time Of Use). 
Lorsqu'un utilisateur soumet un code de parrainage, le code vérifie d'abord s'il a déjà un parrain (`if (currentUser?.referredById)`). Si ce n'est pas le cas, le code continue, met à jour la base de données, et distribue les crédits.

Cependant, si un utilisateur envoie plusieurs requêtes HTTP *exactement en même temps* (en parallèle), toutes les requêtes vont lire la base de données avant que la première n'ait eu le temps d'enregistrer le parrain. Toutes les requêtes vont donc valider la condition initiale et exécuter la distribution de crédits (`addCredits`) plusieurs fois, permettant de générer une infinité de crédits.

### Preuve de Concept (POC)
En utilisant un script Python ou Bash, exécuter cette requête 50 fois en parallèle (multithreading) :

```bash
for i in {1..50}; do
  curl -X POST https://jobsira.com/api/referral \
       -H "Content-Type: application/json" \
       -H "Cookie: __Secure-authjs.session-token=LE_TOKEN_DU_FILLEUL" \
       -d '{"referralCode": "CODE_DU_PARRAIN"}' &
done
wait
```

**Résultat :** Le parrain et le filleul recevront chacun 50 fois les crédits bonus au lieu d'une seule fois.

### Correctifs Recommandés (Mise à jour Atomique / Optimistic Locking)
Il ne faut pas faire la vérification *avant* la transaction, mais *pendant* l'écriture dans la base de données.

**Code à modifier dans `app/api/referral/route.ts` :**

```typescript
// AVANT (Vulnérable) :
await tx.user.update({
  where: { id: currentUserId },
  data: { referredById: referrer.id },
});

// APRÈS (Sécurisé) :
const updateResult = await tx.user.updateMany({
  where: { 
    id: currentUserId,
    referredById: null // C'est le verrou atomique !
  },
  data: { referredById: referrer.id },
});

// Si plusieurs requêtes arrivent en même temps, la 1ère modifie referredById.
// Les suivantes chercheront referredById: null, ne trouveront rien (count = 0), et échoueront.
if (updateResult.count === 0) {
  throw new Error("Déjà parrainé ou erreur de concurrence");
}

// Pour le compteur du parrain, utiliser l'incrémentation atomique (et non la lecture préalable) :
await tx.user.update({
  where: { id: referrer.id },
  data: { referralCount: { increment: 1 } },
});
```
