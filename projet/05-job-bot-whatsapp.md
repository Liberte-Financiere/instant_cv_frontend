# Spécification Technique & Growth : JobBot WhatsApp (Audit Flash & Acquisition Virale)

## 1. Contexte & Problème Résolu
* **Problème :** L'écrasante majorité des jeunes diplômés et étudiants ouest-africains utilise WhatsApp comme canal principal de communication et d'échange de fichiers, plutôt que les emails ou les navigateurs web.
* **Bénéfice :** Permet d'acquérir des milliers d'utilisateurs par simple transfert de contact dans les groupes WhatsApp.

---

## 2. Parcours Utilisateur WhatsApp

```
┌────────────────────────────────┐        ┌────────────────────────────────┐        ┌────────────────────────────────┐
│ 1. ENVOI DU FICHIER            │        │ 2. ANALYSE IA INSTANTANÉE      │        │ 3. CONVERSION SUR LE SITE      │
│ L'utilisateur envoie son CV    │ ─────► │ Le bot répond en 15 secondes : │ ─────► │ Lien magique 1-clic pour       │
│ PDF sur le numéro WhatsApp.    │        │ • Note sur 10 (ex: 6.5/10)     │        │ corriger et générer le PDF     │
│                                │        │ • 3 erreurs critiques          │        │ aux normes sur JobSira.        │
└────────────────────────────────┘        └────────────────────────────────┘        └────────────────────────────────┘
```

---

## 3. Architecture Technique du Bot

1. **Fournisseur WhatsApp Business API :** Meta Cloud API ou passerelle locale / Twilio / Green API.
2. **Webhook Endpoint (`/api/webhooks/whatsapp`) :**
   * Réception du message avec média (document PDF).
   * Téléchargement du buffer PDF.
   * Extraction du texte via `unpdf` ([`app/api/ai/analyze/route.ts`](file:///home/bikienga/Documents/BUSSINESS/saas_cv_lm/frontend/instant_cv/app/api/ai/analyze/route.ts)).
   * Appel léger à Gemini Flash pour générer un audit concis (3 points forts, 3 erreurs).
   * Réponse texte formatée envoyée sur WhatsApp avec le lien d'importation pré-rempli.

---

## 4. Métriques de Succès
* Nombre de CVs audités par jour sur WhatsApp.
* Taux de conversion : % d'utilisateurs WhatsApp qui créent un compte sur JobSira après avoir reçu leur note.
