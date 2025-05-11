#!/usr/bin/env bash
set -euo pipefail

# ────────────────────────────── replica‑sets ──────────────────────────────
echo "⚙️  Bootstrapping replica sets (idempotente)…"
mongosh "mongodb://db-mongo-config-server:27019" /mongo-init-rs.js || true

echo "⏳ Waiting for all primaries …"
for host in \
    db-mongo-config-server:27019 \
    db-mongo-shard-1:27018 \
    db-mongo-shard-2:27020
do
  until mongosh "mongodb://$host" --quiet --eval 'rs.isMaster().ismaster' \
        | grep -q true; do
    echo "   ↪ $host not primary yet…"
    sleep 2
  done
done
echo "✅ All replica‑sets are PRIMARY"

# ──────────────────────────────── mongos ──────────────────────────────────
echo "🚀 Starting mongos …"
mongos --configdb configReplSet/db-mongo-config-server:27019 --bind_ip_all &
MONGOS_PID=$!

until mongosh "mongodb://localhost:27017" --quiet --eval 'db.adminCommand("ping").ok' \
      | grep -q 1; do
  sleep 2
done

# ──────────────────────────────── sharding ──────────────────────────────────
echo "⚙️  Running sharding bootstrap …"
mongosh "mongodb://localhost:27017" /mongo-init-sharding.js || true

echo "✅ Cluster is UP — keeping mongos in foreground"
wait "${MONGOS_PID}"