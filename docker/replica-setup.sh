#!/bin/bash
set -e

# Delete old data
rm -rf "$PGDATA"/*

# Make base backup
PGPASSWORD="${USERS_POSTGRES_PASSWORD}" \
pg_basebackup \
  -h db-users \
  -U replica_user \
  -D "$PGDATA" \
  -Fp -Xs -P -R

# The flag -R already creates a modern recovery.conf with:
# primary_conninfo = 'host=db-users port=5432 user=replica_user password=…'
# and activates hot_standby automatically
chown -R postgres:postgres "$PGDATA"
