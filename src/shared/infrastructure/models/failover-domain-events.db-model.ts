import { DataTypes, Model, Sequelize } from 'sequelize';

export const FAILOVER_DOMAIN_EVENTS_TABLE_NAME = 'failover_domain_events';

export class FailOverDomainEventsDBModel extends Model {
    public eventId!: string;
    public eventName!: string;
    public eventBody!: string;

    public static initModel(sequelize: Sequelize): typeof FailOverDomainEventsDBModel {
        return FailOverDomainEventsDBModel.init(
            {
                eventId: {
                    type: DataTypes.UUID,
                    primaryKey: true,
                },
                eventName: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                eventBody: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                createdAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: new Date().toISOString(),
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: new Date().toISOString(),
                },
            },
            { sequelize, modelName: FAILOVER_DOMAIN_EVENTS_TABLE_NAME }
        );
    }

    toPrimitives() {
        return {
            eventId: this.eventId,
            eventName: this.eventName,
            eventBody: this.eventBody,
        };
    }
}
