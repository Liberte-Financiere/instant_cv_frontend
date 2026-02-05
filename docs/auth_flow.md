# Comprendre l'Authentification Google (NextAuth + Prisma)

Voici comment votre application gère la connexion, étape par étape.

## 🔄 Le Flux (Workflow)

```mermaid
sequenceDiagram
    participant User as Utilisateur
    participant App as Votre App (Frontend)
    participant Google as Google (OAuth)
    participant NextAuth as Backend (NextAuth)
    participant DB as Base de Données (Prisma)

    User->>App: Clique sur "Se connecter avec Google"
    App->>Google: Redirige vers Google
    Google->>User: Demande confirmation (Consentement)
    User->>Google: Accepte
    Google->>NextAuth: Envoie un "Code" unique
    NextAuth->>Google: Échange le Code contre le Profil (Email, Nom, Photo)
    
    rect rgb(240, 248, 255)
        note right of NextAuth: Interaction Base de Données (Automatique)
        NextAuth->>DB: Vérifie si l'email existe dans la table User
        alt Nouvel Utilisateur
            NextAuth->>DB: Crée une ligne 'User' (Jean Dupont)
            NextAuth->>DB: Crée une ligne 'Account' (Lien Google)
        else Utilisateur Existant
            NextAuth->>DB: Met à jour le User (si besoin)
        end
    end

    NextAuth-->>App: Crée un Cookie de Session (Crypté)
    App->>User: Affiche le Dashboard (Connecté)
```

## 💾 Côté Base de Données

Tout se passe grâce à **Prisma Adapter** que nous avons configuré. Il gère 3 tables principales (`prisma/schema.prisma`) :

### 1. `User` (L'Humain)
C'est votre utilisateur unique.
- **Rôle** : Stocke l'identité centrale.
- **Données** : `id`, `name`, `email`, `image`.
- **Lien** : C'est cet `id` (ex: `cm6...`) qui sera utilisé pour sauvegarder les CVs.

### 2. `Account` (La Méthode de Connexion)
C'est le lien technique avec Google.
- **Rôle** : Permet à un utilisateur d'avoir plusieurs méthodes de connexion (ex: Google + GitHub demain).
- **Données** : `provider: "google"`, `access_token`, `refresh_token`.
- **Lien** : Relié à la table `User`.

### 3. `Session` (La Connexion Active)
*Note: Comme nous utilisons la stratégie JWT pour être compatible "Edge", cette table est parfois moins utilisée, mais elle sert si on veut stocker les sessions en base.*

## 🛡️ Côté Code (Backend)

1.  **Le Gardien (`middleware.ts`)** :
    Avant même d'afficher une page, il décrypte le cookie de l'utilisateur.
    *   Cookie Valide ? -> `req.auth` est rempli -> On laisse passer.
    *   Pas de Cookie ? -> Redirection `/login`.

2.  **L'API (`route.ts`)** :
    Quand vous appelez `/api/cv`, le serveur fait :
    ```typescript
    const session = await auth(); // Vérifie le cookie
    // Récupère l'ID de l'utilisateur en base
    const userId = session.user.id; 
    // Cherche les CVs qui appartiennent à cet ID
    prisma.cv.findMany({ where: { userId } })
    ```

**Résumé** : Google prouve l'identité, NextAuth traduit ça en "Session", et Prisma sauvegarde le tout proprement dans votre base PostgreSQL.
