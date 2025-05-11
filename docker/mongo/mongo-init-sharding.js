function safeAddShard(shard) {
    const res = sh.addShard(shard);
    if (res.ok) {
        print(`➕ Added shard ${shard}`);
    } else if (res.codeName === 'isdbgrid' || res.codeName === 'ShardAlreadyExists') {
        print(`ℹ️  Shard ${shard} already present`);
    } else {
        throw new Error(`❌ Failed to add shard ${shard}: ${tojson(res)}`);
    }
}

function tojson(doc) {
    return JSON.stringify(doc, null, 2);
}

(function () {
    safeAddShard('shard1ReplSet/db-mongo-shard-1:27018');
    safeAddShard('shard2ReplSet/db-mongo-shard-2:27020');

    print("📦 Enabling sharding for DB 'video_comments' …");
    sh.enableSharding('video_comments');

    print("📌 Sharding collection 'video_comments.comments' by hashed 'videoId' …");
    try {
        sh.shardCollection('video_comments.comments', { videoId: 'hashed' });
    } catch (e) {
        print(`ℹ️  Collection already sharded or error: ${e.message}`);
    }

    print('✅ Sharding configuration complete');
})();
