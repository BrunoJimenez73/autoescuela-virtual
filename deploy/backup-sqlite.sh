#!/usr/bin/env bash
# ============================================================
# Copia de seguridad de la base de datos SQLite de Autoescuela
# Creamos un fichero consistente (WAL checkpoint + .backup) y
# conservamos las ultimas $KEEP copias.
# Configurar en cron (ej: 0 3 * * * backup-autoescuela.sh)
# ============================================================
set -euo pipefail

DB_PATH="/var/lib/autoescuela/autoescuela.db"
BKPDIR="/var/lib/autoescuela/backups"
KEEP=14

mkdir -p "$BKPDIR"
STAMP="$(date +%Y-%m-%d_%H%M%S)"

if [ ! -f "$DB_PATH" ]; then
  echo "No existe $DB_PATH, no hay nada que respaldar"
  exit 0
fi

# Compacta el WAL para que el backup refleje todo lo escrito
sqlite3 "$DB_PATH" "PRAGMA wal_checkpoint(TRUNCATE);" 2>/dev/null || true
sqlite3 "$DB_PATH" ".backup '$BKPDIR/autoescuela-$STAMP.db'"

# Rotacion: conservar solo los KEEP mas recientes
ls -1t "$BKPDIR"/autoescuela-*.db 2>/dev/null | tail -n +$((KEEP + 1)) | xargs -r rm -f --

echo "Backup OK: $BKPDIR/autoescuela-$STAMP.db"