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

function getEnvVar(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing env var: ${name}`);
    }
    return value;
}

function tojson(doc) {
    return JSON.stringify(doc, null, 2);
}

(function () {
    const shard1Host = getEnvVar('SHARD_1_HOST') + ':' + getEnvVar('SHARD_1_PORT');
    const shard2Host = getEnvVar('SHARD_2_HOST') + ':' + getEnvVar('SHARD_2_PORT');
    const dbName = getEnvVar('MONGO_DB_NAME');
    const collectionName = getEnvVar('MONGO_COLLECTION_NAME');

    safeAddShard(`shard1ReplSet/${shard1Host}`);
    safeAddShard(`shard2ReplSet/${shard2Host}`);

    print(`📦 Enabling sharding for DB '${dbName}' …`);
    sh.enableSharding(dbName);

    print(`📌 Sharding collection '${dbName}.${collectionName}' by hashed 'videoId' …`);
    try {
        sh.shardCollection(`${dbName}.${collectionName}`, { videoId: 'hashed' });
    } catch (e) {
        print(`ℹ️  Collection already sharded or error: ${e.message}`);
    }

    print('✅ Sharding configuration complete');
})();
