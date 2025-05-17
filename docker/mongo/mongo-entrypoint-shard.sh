#!/usr/bin/env bash
set -euo pipefail

DATA_DIR=/data/db
KEYFILE=/etc/mongo-keyfile
RS_NAME=${RS_NAME:-shard1ReplSet}
PORT=${PORT:-27019}

if [ -f "$DATA_DIR/.rs-initialized" ]; then
  echo "🔒 Already initialized ($RS_NAME) — starting with auth"
  exec mongod \
    --shardsvr \
    --replSet "$RS_NAME" \
    --port "$PORT" \
    --bind_ip_all \
    --keyFile "$KEYFILE" \
    --auth \
    --dbpath "$DATA_DIR"
fi

echo "🛠 First startup of $RS_NAME: launching mongod without auth/keyFile"
mongod \
  --shardsvr \
  --replSet "$RS_NAME" \
  --port "$PORT" \
  --bind_ip_all \
  --dbpath "$DATA_DIR" \
  --fork --logpath "$DATA_DIR/mongod-init.log"

echo "⏳ Waiting for mongod ready (no auth)..."
until mongosh --host localhost --port "$PORT" --eval 'db.adminCommand("ping")' --quiet; do
  sleep 1
done

echo "✅ Initiating Replica Set $RS_NAME"
mongosh --host localhost --port "$PORT" --eval "
  rs.initiate({
    _id: '$RS_NAME',
    members: [{ _id: 0, host: '${HOSTNAME}:$PORT' }]
  });
"

echo "⏳ Waiting for PRIMARY..."
until mongosh --host localhost --port "$PORT" --eval 'db.hello().isWritablePrimary' --quiet; do
  sleep 1
done

echo "✅ Creating root user in $RS_NAME"
mongosh --host localhost --port "$PORT" --eval "
  db.getSiblingDB('admin').createUser({
    user: 'root',
    pwd: 'password',
    roles: [{ role: 'root', db: 'admin' }]
  });
"

touch "$DATA_DIR/.rs-initialized"
chown 999:999 "$DATA_DIR/.rs-initialized"
chmod 600 "$DATA_DIR/.rs-initialized"

mongosh --host localhost --port "$PORT" \
  --eval "db.getSiblingDB('admin').shutdownServer()" || echo "🔌 Mongod shutdown (expected connection closed)"

sleep 2

echo "🔒 Restarting $RS_NAME with auth/keyFile"
exec mongod \
  --shardsvr \
  --replSet "$RS_NAME" \
  --port "$PORT" \
  --bind_ip_all \
  --keyFile "$KEYFILE" \
  --auth \
  --dbpath "$DATA_DIR"