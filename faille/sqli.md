# Risque Élevé : Injection SQL (Technical Debt)

**Fichier concerné :** `lib/talent-assistant.ts`

### Description
Le code utilise la fonction `$queryRawUnsafe` de Prisma en concaténant dynamiquement une variable (`${vectorString}`) dans la requête SQL brute.
Bien que la variable soit actuellement inoffensive car elle est générée par l'API de Google Gemini (qui renvoie un tableau de nombres flottants), cette pratique est formellement interdite par les standards de sécurité (et signalée par les outils comme Checkmarx). Si la source de données venait à changer ou si une erreur API renvoyait une chaîne non filtrée, la base de données entière serait exposée à une attaque d'injection SQL destructrice.

### Correctif
Utiliser la fonction sécurisée `$queryRaw` avec un "Tagged Template Literal" pour que Prisma puisse préparer la requête et sanétiser les variables automatiquement via le pilote PostgreSQL.

```typescript
// AVANT (Vulnérable / Signalé par les scanners de sécurité)
const results = await prisma.$queryRawUnsafe<Array<{id: string, distance: number}>>(
  `SELECT "id", ("embedding" <=> '${vectorString}'::vector) as distance FROM "CandidateProfile" WHERE "isActive" = true ORDER BY distance ASC LIMIT 50`
);

// APRÈS (Sécurisé)
const results = await prisma.$queryRaw<Array<{id: string, distance: number}>>`
  SELECT "id", ("embedding" <=> ${vectorString}::vector) as distance 
  FROM "CandidateProfile" 
  WHERE "isActive" = true 
  ORDER BY distance ASC LIMIT 50
`;
```
