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
    const configHost = getEnvVar('CONFIG_SERVER_HOST') + ':' + getEnvVar('CONFIG_SERVER_PORT');
    const shard1Host = getEnvVar('SHARD_1_HOST') + ':' + getEnvVar('SHARD_1_PORT');
    const shard2Host = getEnvVar('SHARD_2_HOST') + ':' + getEnvVar('SHARD_2_PORT');

    initiateReplicaSet({
        name: 'Config Server',
        host: configHost,
        replSetId: 'configReplSet',
        isConfig: true,
    });

    sleep(3000);

    initiateReplicaSet({
        name: 'Shard 1',
        host: shard1Host,
        replSetId: 'shard1ReplSet',
    });

    initiateReplicaSet({
        name: 'Shard 2',
        host: shard2Host,
        replSetId: 'shard2ReplSet',
    });

    print('✅ Replica sets ready');
})();
