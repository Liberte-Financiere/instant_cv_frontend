# Faille Critique : Insecure Webhook (Contournement de Paiement)

**Fichier concerné :** `app/api/payment/callback/route.ts`

### Description
Le fichier de callback, censé recevoir les confirmations de paiement de LigdiCash, faisait une confiance aveugle au corps de la requête HTTP (le `payload`). 
Il ne vérifiait ni l'origine de la requête (absence de signature HMAC), ni l'authenticité de la transaction auprès de l'API LigdiCash.
Un attaquant pouvait forger une fausse requête de confirmation avec le statut `completed` et un montant arbitraire pour déclencher l'ajout de crédits sur son compte, sans payer.

*(Note : Dans la configuration actuelle avec le "Payin sans redirection", cette attaque nécessitait au préalable que le pirate génère un vrai OTP valide avec suffisamment de fonds pour que LigdiCash valide la première étape, puis qu'il forge l'appel au Webhook).*

### Preuve de Concept (POC)
Via Burp Suite, envoyer la requête suivante :
```http
POST /api/payment/callback HTTP/1.1
Host: jobsira.com
Content-Type: application/json

{
  "token": "VRAI_TOKEN_LIGDICASH_EN_ATTENTE",
  "status": "completed",
  "amount": "50000",
  "transaction_id": "PIRATAGE_123"
}
```
**Résultat (avant correction) :** Le serveur mettait à jour la transaction comme `completed` et créditait l'utilisateur.

### Correctif (Appliqué)
Le serveur doit toujours être la source de vérité. Lors de la réception d'un webhook, on utilise le token fourni pour interroger directement l'API sécurisée du processeur de paiement.

```typescript
// APRÈS (Sécurisé)
if (status === 'completed') {
    // 1. On interroge LigdiCash (Source de vérité)
    const realStatus = await import('@/lib/ligdicash').then(m => m.verifyTransactionStatus(token));
    
    // 2. On vérifie que LigdiCash confirme bien que c'est payé
    const isConfirmed = await import('@/lib/ligdicash').then(m => m.isPaymentConfirmed(realStatus));
    if (!isConfirmed) {
      return NextResponse.json({ status: 'fraud_prevented' }, { status: 200 });
    }

    // 3. On utilise le vrai montant renvoyé par l'API
    const paidAmount = parseFloat(realStatus.amount || realStatus.montant || '0');
    // ...
}
```
