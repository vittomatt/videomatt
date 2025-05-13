#!/usr/bin/env bash
set -euo pipefail

# ────────────────────────────── validation ──────────────────────────────
: "${CONFIG_SERVER_HOST:?Missing CONFIG_SERVER_HOST}"
: "${CONFIG_SERVER_PORT:?Missing CONFIG_SERVER_PORT}"
: "${SHARD_1_HOST:?Missing SHARD_1_HOST}"
: "${SHARD_1_PORT:?Missing SHARD_1_PORT}"
: "${SHARD_2_HOST:?Missing SHARD_2_HOST}"
: "${SHARD_2_PORT:?Missing SHARD_2_PORT}"
: "${MONGOS_PORT:?Missing MONGOS_PORT}"

# ────────────────────────────── replica-sets ──────────────────────────────
echo "⚙️  Bootstrapping replica sets (idempotent)…"
mongosh "mongodb://${CONFIG_SERVER_HOST}:${CONFIG_SERVER_PORT}" /mongo-init-rs.js || true

echo "⏳ Waiting for all primaries …"
for host in \
    "${CONFIG_SERVER_HOST}:${CONFIG_SERVER_PORT}" \
    "${SHARD_1_HOST}:${SHARD_1_PORT}" \
    "${SHARD_2_HOST}:${SHARD_2_PORT}"
do
  until mongosh "mongodb://${host}" --quiet --eval 'rs.isMaster().ismaster' \
        | grep -q true; do
    echo "   ↪ $host not primary yet…"
    sleep 2
  done
done
echo "✅ All replica-sets are PRIMARY"

# ──────────────────────────────── mongos ──────────────────────────────────
echo "🚀 Starting mongos on port ${MONGOS_PORT} …"
mongos --port "${MONGOS_PORT}" --configdb configReplSet/${CONFIG_SERVER_HOST}:${CONFIG_SERVER_PORT} --bind_ip_all &
MONGOS_PID=$!

until mongosh "mongodb://localhost:${MONGOS_PORT}" --quiet --eval 'db.adminCommand("ping").ok' \
      | grep -q 1; do
  echo "   ↪ Waiting for mongos on port ${MONGOS_PORT} to be ready…"
  sleep 2
done

# ──────────────────────────────── sharding ────────────────────────────────
echo "⚙️  Running sharding bootstrap …"
mongosh "mongodb://localhost:${MONGOS_PORT}" /mongo-init-sharding.js || true

echo "✅ Cluster is UP — keeping mongos in foreground"
wait "${MONGOS_PID}"