#!/bin/bash
set -e

# Delete old data
rm -rf "$PGDATA"/*

# Make base backup
PGPASSWORD="${DB_REPLICA_PASSWORD}" \
pg_basebackup \
  -h ${DB_HOST} \
  -U ${DB_REPLICA_USER} \
  -D "$PGDATA" \
  -Fp -Xs -P -R

# The flag -R already creates a modern recovery.conf with:
# primary_conninfo = 'host=db-users port=5432 user=replica_user password=…'
# and activates hot_standby automatically
chown -R postgres:postgres "$PGDATA"
