#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 <<-EOSQL
  CREATE ROLE replica_user WITH REPLICATION LOGIN ENCRYPTED PASSWORD '${USERS_REPLICA_PASSWORD}';
  ALTER SYSTEM SET wal_level = 'replica';
  ALTER SYSTEM SET max_wal_senders = 5;
  ALTER SYSTEM SET wal_keep_size = '64MB';
  ALTER SYSTEM SET hot_standby = on;
EOSQL
