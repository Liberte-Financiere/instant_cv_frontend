# Faille Critique : Stored XSS (Cross-Site Scripting)

**Fichier concerné :** `components/cv-sections/CVDescription.tsx`

### Description
Le composant React qui affiche la description des expériences professionnelles utilise la propriété `dangerouslySetInnerHTML` dès qu'il détecte une balise HTML. Cela désactive la protection native de React (l'échappement) et permet d'injecter des scripts malveillants directement dans le navigateur des recruteurs visitant le CV.
En prime, cette logique ignorait les sauts de ligne (`\n`) pour les utilisateurs normaux.

### Preuve de Concept (POC)
Ajouter cette description dans une expérience via l'interface du formulaire :
```html
<img src="x" onerror="alert('POC XSS RÉUSSI')">
```
**Résultat :** Dès que la page du CV public ou de l'aperçu est chargée, le navigateur exécute le code JavaScript de l'attaquant (la popup s'affiche).

### Correctif
Supprimer totalement l'utilisation de `dangerouslySetInnerHTML` et la condition `hasHTML` pour revenir à l'affichage textuel sécurisé par défaut de React (qui gère par ailleurs très bien le `split('\n')` pour les sauts de ligne).

```tsx
// AVANT (Vulnérable)
  const hasHTML = /<[a-z][\s\S]*>/i.test(description);
  if (hasHTML) {
    return (
      <div 
        className={`cv-description ${cleanClassName}`}
        dangerouslySetInnerHTML={{ __html: description }}
      />
    );
  }

// APRÈS (Sécurisé)
// -> Supprimer entièrement ce bloc de code.
```
