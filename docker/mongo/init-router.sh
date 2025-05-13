#!/usr/bin/env bash
set -euo pipefail

ROUTER_HOST=db-video-comments-router
ROUTER_PORT=27017

SHARD1_HOST=db-mongo-shard-1
SHARD1_PORT=27019
SHARD1_RS=shard1ReplSet

SHARD2_HOST=db-mongo-shard-2
SHARD2_PORT=27020
SHARD2_RS=shard2ReplSet

echo "⏳ Waiting for mongos to be ready at $ROUTER_HOST:$ROUTER_PORT..."
until mongosh --host $ROUTER_HOST --port $ROUTER_PORT -u root -p password --authenticationDatabase admin --eval "sh.status()" --quiet; do
  echo "🔄 Still waiting for mongos..."
  sleep 2
done

echo "⏳ Waiting for shard1 to be PRIMARY..."
until mongosh --host $SHARD1_HOST --port $SHARD1_PORT -u root -p password --authenticationDatabase admin --eval 'db.hello().isWritablePrimary' --quiet | grep true; do
  echo "🔄 Still waiting for shard1 PRIMARY..."
  sleep 2
done

echo "⏳ Waiting for shard2 to be PRIMARY..."
until mongosh --host $SHARD2_HOST --port $SHARD2_PORT -u root -p password --authenticationDatabase admin --eval 'db.hello().isWritablePrimary' --quiet | grep true; do
  echo "🔄 Still waiting for shard2 PRIMARY..."
  sleep 2
done

echo "✅ All shards PRIMARY. Registering shards..."

mongosh --host $ROUTER_HOST --port $ROUTER_PORT -u root -p password --authenticationDatabase admin --eval "sh.addShard('$SHARD1_RS/$SHARD1_HOST:$SHARD1_PORT')" || (echo "❌ Failed to add $SHARD1_RS" && exit 1)

mongosh --host $ROUTER_HOST --port $ROUTER_PORT -u root -p password --authenticationDatabase admin --eval "sh.addShard('$SHARD2_RS/$SHARD2_HOST:$SHARD2_PORT')" || (echo "❌ Failed to add $SHARD2_RS" && exit 1)
echo "🎉 Shards registered successfully"

echo "🔧 Enabling sharding for database and collection..."
mongosh --host $ROUTER_HOST --port $ROUTER_PORT -u root -p password --authenticationDatabase admin --eval "
  sh.enableSharding('video_comments');
  sh.shardCollection('video_comments.comments', { videoId: 'hashed' });
"
echo "✅ Database and collection sharded successfully"