import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize';

export const FAILOVER_DOMAIN_EVENTS_TABLE_NAME = 'failover_domain_events';

export function defineModel(sequelize: Sequelize) {
    class FailOverDomainEventsDBModel extends Model<
        InferAttributes<FailOverDomainEventsDBModel>,
        InferCreationAttributes<FailOverDomainEventsDBModel>
    > {
        declare eventId: string;
        declare eventName: string;
        declare eventBody: string;

        declare createdAt: CreationOptional<Date>;
        declare updatedAt: CreationOptional<Date>;

        toPrimitives() {
            return {
                eventId: this.eventId,
                eventName: this.eventName,
                eventBody: this.eventBody,
            };
        }
    }

    FailOverDomainEventsDBModel.init(
        {
            eventId: { type: DataTypes.UUID, primaryKey: true },
            eventName: { type: DataTypes.STRING, allowNull: false },
            eventBody: { type: DataTypes.TEXT, allowNull: false },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        },
        {
            sequelize,
            tableName: FAILOVER_DOMAIN_EVENTS_TABLE_NAME,
            modelName: FAILOVER_DOMAIN_EVENTS_TABLE_NAME,
            timestamps: true,
        }
    );

    return FailOverDomainEventsDBModel;
}
