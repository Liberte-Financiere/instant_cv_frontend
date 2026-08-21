# Faille Logique : Perte de Crédits Utilisateur (Absence de Remboursement)

**Fichiers concernés :** 
- `app/api/ai/analyze/route.ts`
- `app/api/ai/cover-letter/generate/route.ts`
- (Globalement, toutes les routes IA sauf `remove-bg`)

### Description de la vulnérabilité
Dans les endpoints payants faisant appel à l'Intelligence Artificielle (OpenAI, OpenRouter, Gemini), le système de facturation présente un défaut de logique majeur : **il débite les crédits de l'utilisateur AVANT d'appeler l'API, mais ne le rembourse jamais si l'appel à l'API échoue.**

Si le fournisseur d'IA rencontre un problème (erreur 500, quota dépassé 429, timeout, ou même si la clé d'API est manquante sur le serveur), l'utilisateur perd définitivement ses crédits sans avoir reçu de service. Cela crée une très mauvaise expérience utilisateur et s'apparente à un "vol" involontaire de crédits (Denial of Service financier).

### Preuve de Concept (Exemple sur `cover-letter/generate`)
1. Le code vérifie et débite les crédits à la ligne 27 : `await checkAndConsumeCredits(...)`
2. Si la clé d'API OpenRouter est manquante, le code retourne une erreur 500 à la ligne 60.
3. Si l'appel `streamObject` échoue (ex: erreur 429), l'erreur est capturée par le `catch` global à la ligne 91.
4. Dans aucun de ces cas la fonction `refundCredits` n'est appelée.

*(Note : le fichier `remove-bg/route.ts` gère correctement ce cas en appelant `refundCredits` en cas d'échec).*

### Correctifs Recommandés
Il faut s'assurer que toute défaillance technique après le débit entraîne un remboursement.

**Exemple de correction dans les blocs `catch` globaux des routes IA :**

```typescript
// Importer refundCredits en haut du fichier
import { checkAndConsumeCredits, refundCredits } from '@/lib/credits';

// Dans le catch(error) global :
} catch (error: any) {
  console.error('AI Generation Detailed Error:', error);

  // Rembourser l'utilisateur en cas d'échec technique (si la session existe)
  if (session?.user?.id) {
    try {
      await refundCredits(session.user.id, 'AI_GENERATE_LETTER', 'Remboursement suite à une erreur technique IA');
    } catch (refundError) {
      console.error('Échec du remboursement automatique:', refundError);
    }
  }

  // Suite du code (logAIUsage, NextResponse...)
  // ...
}
```
