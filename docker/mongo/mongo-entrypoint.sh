#!/usr/bin/env bash
set -euo pipefail

# Two-phase Mongo config server startup with debug logging

DATA_DIR=/data/configdb
KEYFILE=/etc/mongo-keyfile
RS_NAME=configReplSet
PORT=27018

# Create keyfile from environment variable
echo "$VIDEO_COMMENTS_MONGO_KEY_FILE" > /etc/mongo-keyfile
chmod 600 /etc/mongo-keyfile
chown mongodb:mongodb /etc/mongo-keyfile

# If already initialized, start with auth
if [ -f "$DATA_DIR/.rs-initialized" ]; then
  echo "🔒 Already initialized — starting with auth"
  exec mongod \
    --configsvr \
    --replSet "$RS_NAME" \
    --port "$PORT" \
    --bind_ip_all \
    --keyFile "$KEYFILE" \
    --auth \
    --dbpath "$DATA_DIR"
fi

echo "🛠 First startup: launching mongod without auth/keyFile"
mongod \
  --configsvr \
  --replSet "$RS_NAME" \
  --port "$PORT" \
  --bind_ip_all \
  --dbpath "$DATA_DIR" \
  --fork --logpath "$DATA_DIR/mongod-init.log"

echo "⏳ Waiting for mongod ready (no auth)..."
until mongosh --host localhost --port "$PORT" \
    --eval 'db.adminCommand("ping")' --quiet; do
  sleep 1
done

echo "✅ Initiating Replica Set"
mongosh --host localhost --port "$PORT" --eval "
  rs.initiate({
    _id: '$RS_NAME',
    configsvr: true,
    members: [{ _id: 0, host: 'db-mongo-config-server:$PORT' }]
  });
"

echo "⏳ Waiting for PRIMARY..."
until mongosh --host localhost --port "$PORT" \
    --eval 'db.hello().isWritablePrimary' --quiet; do
  sleep 1
done

echo "✅ Creating root user"
mongosh --host localhost --port "$PORT" --eval "
  db.getSiblingDB('admin').createUser({
    user: '${MONGO_DB_USER}',
    pwd: '${MONGO_DB_PASSWORD}',
    roles: [{ role: 'root', db: 'admin' }]
  });
"

echo "📋 Listing admin users for verification"
mongosh --host localhost --port "$PORT" --eval "
  printjson(db.getSiblingDB('admin').getUsers());
"

echo "🎉 Initialization complete — marker and shutdown next"
touch "$DATA_DIR/.rs-initialized"
chown 999:999 "$DATA_DIR/.rs-initialized"
chmod 600 "$DATA_DIR/.rs-initialized"

echo "🛑 Shutting down mongod (init done)"
# ignore expected socket close error
mongosh --host localhost --port "$PORT" \
  --eval "db.getSiblingDB('admin').shutdownServer()" \
  || echo "🔌 Mongod shutdown (expected connection closed)"

sleep 2

echo "🔒 Restarting mongod with auth/keyFile"
exec mongod \
  --configsvr \
  --replSet "$RS_NAME" \
  --port "$PORT" \
  --bind_ip_all \
  --keyFile "$KEYFILE" \
  --auth \
  --dbpath "$DATA_DIR"