#!/bin/bash
set -e

# Delete old data
echo "Cleaning old PGDATA..."
rm -rf "$PGDATA"/*

echo "Waiting for primary DB ($DB_HOST) to become available..."
until pg_isready -h "$DB_HOST" -U "$DB_REPLICA_USER"; do
  echo "Primary not ready, waiting..."
  sleep 2
done

echo "Starting base backup from primary..."
PGPASSWORD="$DB_REPLICA_PASSWORD" pg_basebackup \
  -h "$DB_HOST" \
  -U "$DB_REPLICA_USER" \
  -D "$PGDATA" \
  -Fp -Xs -P -R

echo "Setting correct permissions..."
chown -R postgres:postgres "$PGDATA"

echo "Replica setup complete."