export const TOKEN = {
    // Storage
    DB: Symbol('DB'),
    MONGO_DB: Symbol('MONGO_DB'),

    LOGGER: Symbol('LOGGER'),
    DOMAIN_EVENT_BUS: Symbol('DOMAIN_EVENT_BUS'),
    DEFERRED_DOMAIN_EVENT_BUS: Symbol('DEFERRED_DOMAIN_EVENT_BUS'),

    // AWS
    SNS_CLIENT: Symbol('SNS_CLIENT'),
    SQS_CLIENT: Symbol('SQS_CLIENT'),
    EVENT_BRIDGE_CLIENT: Symbol('EVENT_BRIDGE_CLIENT'),
};
