#!/bin/bash
set -e

cat >> "$PGDATA"/pg_hba.conf <<-EOF
host replication ${DB_REPLICA_USER} 0.0.0.0/0 md5
EOF

psql -v ON_ERROR_STOP=1 <<-EOSQL
  CREATE ROLE ${DB_REPLICA_USER} WITH REPLICATION LOGIN ENCRYPTED PASSWORD '${DB_REPLICA_PASSWORD}';
  ALTER SYSTEM SET wal_level = 'replica';
  ALTER SYSTEM SET max_wal_senders = 5;
  ALTER SYSTEM SET wal_keep_size = '64MB';
  ALTER SYSTEM SET hot_standby = on;
EOSQL
