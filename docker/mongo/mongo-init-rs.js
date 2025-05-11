function initiateReplicaSet({ name, host, replSetId, isConfig = false }) {
    print(`⚙️  Checking ${name} on ${host} ...`);
    const conn = new Mongo(host);
    const admin = conn.getDB('admin');

    try {
        const status = admin.runCommand({ replSetGetStatus: 1 });
        if (status.ok === 1) {
            print(`✅ ${name} already initiated.`);
            return;
        }
    } catch (e) {
        // expected if not initiated
    }

    print(`🚀 Initiating ${name} ...`);
    const cfg = {
        _id: replSetId,
        members: [{ _id: 0, host }],
        ...(isConfig ? { configsvr: true } : {}),
    };
    const res = admin.runCommand({ replSetInitiate: cfg });
    print(`${name} initiate result:`, tojson(res));
}

function tojson(doc) {
    return JSON.stringify(doc, null, 2);
}

(function () {
    initiateReplicaSet({
        name: 'Config Server',
        host: 'db-mongo-config-server:27019',
        replSetId: 'configReplSet',
        isConfig: true,
    });

    sleep(3000);

    initiateReplicaSet({
        name: 'Shard 1',
        host: 'db-mongo-shard-1:27018',
        replSetId: 'shard1ReplSet',
    });

    initiateReplicaSet({
        name: 'Shard 2',
        host: 'db-mongo-shard-2:27020',
        replSetId: 'shard2ReplSet',
    });

    print('✅ Replica sets ready');
})();
