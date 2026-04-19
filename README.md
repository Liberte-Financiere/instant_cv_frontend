# JobSira Database Backups

Branche dediee aux sauvegardes automatiques de la base Supabase.

## Fonctionnement
- Le workflow GitHub Actions tourne chaque jour a 2h UTC
- Il dump la base en 3 fichiers (roles, schema, data)
- Les 3 fichiers sont compresses en `.tar.gz` et commites ici
- Les backups de plus de 30 jours sont supprimes automatiquement

## Restauration manuelle
```bash
# Decompresser un backup
tar -xzf backups/2026-04-19.tar.gz

# Restaurer (dans l'ordre)
psql "$DB_URL" -f roles.sql
psql "$DB_URL" -f schema.sql
psql "$DB_URL" -f data.sql
```

## Structure
```
backups/
  2026-04-17.tar.gz
  2026-04-18.tar.gz
  ...
```
