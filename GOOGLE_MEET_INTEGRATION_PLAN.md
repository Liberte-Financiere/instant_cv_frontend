# Plan d'Intégration Technique — Google Meet API (Jobsira)

Ce document décrit l'architecture, la configuration et l'implémentation pour permettre à la plateforme Jobsira de générer automatiquement des réunions Google Meet à coût nul (0 €), via un compte organisateur dédié (`meet@jobsira.com`).

---

## 1. Vue d'Ensemble & Objectifs

* **Objectif** : Générer des liens de visioconférence Google Meet à la demande depuis Jobsira, sans forcer les utilisateurs (recruteurs, candidats, experts) à connecter leurs comptes Google personnels.
* **Coût** : 0 € (utilisation d'un compte Google gratuit associé au domaine `jobsira.com` via Cloudflare).
* **Cas d'usage couverts** :
  1. **Réunions programmées avec invitations automatiques** : Les participants reçoivent un email officiel Google Calendar avec le lien Meet.
  2. **Réunions libres / instantanées** : L'application récupère directement l'URL `https://meet.google.com/xxx-yyyy-zzz` pour l'afficher dans l'interface Jobsira.

---

## 2. Architecture & Schéma de Flux

```
                        Flux de Génération Google Meet
                        ─────────────────────────────

  [Recruteur / Candidat / App Jobsira]
                  │
                  │ 1. Demande de création de réunion
                  ▼
  [Backend Jobsira (Next.js / Python / Go)]
                  │
                  │ 2. Authentification via GOOGLE_REFRESH_TOKEN
                  │    (Compte : meet@jobsira.com)
                  ▼
  [Google Calendar API (v3)]
                  │
                  │ 3. Insertion d'événement + `conferenceDataVersion=1`
                  ▼
        ┌────────────────────────────────────────────────────────┐
        │                                                        │
        ▼                                                        ▼
  [Lien Google Meet généré]                    [Notification par Email]
  (meet.google.com/xxx-yyyy-zzz)               (sendUpdates="all" via Google
        │                                       OU via service email Jobsira)
        ▼
  [Affichage dans Jobsira UI]
```

---

## 3. Configuration Initiale (À réaliser une seule fois)

### Étape 1 : Créer le compte Google gratuit avec `meet@jobsira.com`
1. Assurez-vous que l'adresse `meet@jobsira.com` est configurée dans **Cloudflare Email Routing** pour transférer les emails vers votre boîte de réception principale.
2. Rendez-vous sur le formulaire Google : [Créer un compte Google sans Gmail](https://accounts.google.com/signup/withoutgmail).
3. Saisissez `meet@jobsira.com` et validez le code de sécurité reçu par email.

### Étape 2 : Configurer Google Cloud Platform (GCP)
1. Connectez-vous sur la [Google Cloud Console](https://console.cloud.google.com/) avec le compte `meet@jobsira.com`.
2. Créez un nouveau projet (nommé par exemple `Jobsira-Meet-Service`).
3. Activez l'API :
   * Allez dans **APIs & Services > Library**.
   * Recherchez **Google Calendar API** et cliquez sur **Enable (Activer)**.

### Étape 3 : Configurer l'écran de consentement OAuth & Créer les identifiants
1. Allez dans **APIs & Services > OAuth consent screen**.
2. Choisissez le type **External**.
3. Remplissez les informations de base (Nom : `Jobsira`, Email support : `meet@jobsira.com`).
4. Dans **Scopes (Champs d'application)**, ajoutez :
   * `https://www.googleapis.com/auth/calendar.events`
5. Allez dans **Credentials > Create Credentials > OAuth client ID** :
   * Type d'application : **Web application** (ou **Desktop app** pour faciliter la génération initiale du token).
   * Notez précieusement votre `Client ID` et votre `Client Secret`.

### Étape 4 : Générer le `refresh_token` permanent
Utilisez l'[OAuth 2.0 Playground](https://developers.google.com/oauthplayground) ou un script local :
1. Dans OAuth Playground, renseignez vos propres `Client ID` et `Client Secret` dans les paramètres (icône engrenage).
2. Sélectionnez le scope `https://www.googleapis.com/auth/calendar.events`.
3. Autorisez l'accès avec le compte `meet@jobsira.com`.
4. Échangez le code d'autorisation contre les tokens : vous obtenez le `refresh_token`.

---

## 4. Variables d'Environnement (.env)

Ajoutez les variables suivantes dans la configuration de votre serveur :

```env
GOOGLE_MEET_CLIENT_ID="VOTRE_CLIENT_ID.apps.googleusercontent.com"
GOOGLE_MEET_CLIENT_SECRET="GOCSPX-VOTRE_SECRET"
GOOGLE_MEET_REFRESH_TOKEN="1//04_VOTRE_REFRESH_TOKEN_PERMANENT"
```

---

## 5. Implémentations Backend

### Option A : TypeScript / Next.js (App Router / Server Actions)

```typescript
// lib/google-meet.ts
import { google } from "googleapis";
import { randomUUID } from "crypto";

interface CreateMeetingParams {
  summary: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  attendeesEmails?: string[];
  sendGoogleNotification?: boolean;
}

export async function createGoogleMeeting({
  summary,
  description = "Entretien Jobsira",
  startTime,
  endTime,
  attendeesEmails = [],
  sendGoogleNotification = false,
}: CreateMeetingParams) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_MEET_CLIENT_ID,
    process.env.GOOGLE_MEET_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_MEET_REFRESH_TOKEN,
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const attendees = attendeesEmails.map((email) => ({ email }));

  const response = await calendar.events.insert({
    calendarId: "primary",
    conferenceDataVersion: 1,
    sendUpdates: sendGoogleNotification ? "all" : "none",
    requestBody: {
      summary,
      description,
      start: {
        dateTime: startTime.toISOString(),
      },
      end: {
        dateTime: endTime.toISOString(),
      },
      attendees,
      conferenceData: {
        createRequest: {
          requestId: randomUUID(),
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    },
  });

  return {
    eventId: response.data.id,
    meetUrl: response.data.hangoutLink,
    htmlLink: response.data.htmlLink,
  };
}
```

---

### Option B : Python (FastAPI / Celery)

```python
# services/google_meet.py
import uuid
from datetime import datetime
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
import os

def create_google_meeting(
    summary: str,
    start_time: datetime,
    end_time: datetime,
    attendees_emails: list[str] = None,
    send_notification: bool = False
) -> dict:
    creds = Credentials(
        token=None,
        refresh_token=os.getenv("GOOGLE_MEET_REFRESH_TOKEN"),
        token_uri="https://oauth2.googleapis.com/token",
        client_id=os.getenv("GOOGLE_MEET_CLIENT_ID"),
        client_secret=os.getenv("GOOGLE_MEET_CLIENT_SECRET"),
    )

    service = build("calendar", "v3", credentials=creds)

    attendees = [{"email": email} for email in (attendees_emails or [])]

    event_body = {
        "summary": summary,
        "description": "Entretien planifié via Jobsira",
        "start": {"dateTime": start_time.isoformat(), "timeZone": "UTC"},
        "end": {"dateTime": end_time.isoformat(), "timeZone": "UTC"},
        "attendees": attendees,
        "conferenceData": {
            "createRequest": {
                "requestId": str(uuid.uuid4()),
                "conferenceSolutionKey": {"type": "hangoutsMeet"},
            }
        },
    }

    event = service.events().insert(
        calendarId="primary",
        body=event_body,
        conferenceDataVersion=1,
        sendUpdates="all" if send_notification else "none",
    ).execute()

    return {
        "event_id": event.get("id"),
        "meet_url": event.get("hangoutLink"),
    }
```

---

## 6. Synthèse des Limites & Bonnes Pratiques

| Paramètre | Spécification | Recommandation pour Jobsira |
| :--- | :--- | :--- |
| **Durée max (3 à 5 pers.)** | **60 minutes exactes** | Configurer des créneaux d'entretien de **45 minutes** par défaut dans l'UI. |
| **Durée max (1 à 1)** | 24 heures | Aucun risque d'interruption. |
| **Participants max** | 100 personnes | Largement suffisant pour candidat + recruteur + experts. |
| **Volume de réunions / jour** | Illimité (1M requêtes API / jour) | Supporte la charge sans frais additionnels. |
| **Envoi d'invitations** | Limité par Google si gratuit | **Recommandé** : Laisser votre backend envoyer l'email avec votre template Jobsira (Resend / SMTP) pour un meilleur branding. |

---

## 7. Prochaines Étapes pour le Déploiement

1. [ ] Créer le compte Google gratuit sur `accounts.google.com/signup/withoutgmail` avec `meet@jobsira.com`.
2. [ ] Activer le projet GCP et récupérer `GOOGLE_MEET_CLIENT_ID`, `GOOGLE_MEET_CLIENT_SECRET`, et `GOOGLE_MEET_REFRESH_TOKEN`.
3. [ ] Ajouter le service `createGoogleMeeting` dans la codebase Jobsira.
4. [ ] Connecter le service au formulaire de planification d'entretiens.
