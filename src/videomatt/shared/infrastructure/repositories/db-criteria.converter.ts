import { Op, Order as SequelizeOrder } from 'sequelize';

import { FilterOperator, Filters } from '@videomatt/shared/domain/repositories/filters';
import { Order, OrderType } from '@videomatt/shared/domain/repositories/order';
import { Criteria } from '@videomatt/shared/domain/repositories/criteria';

const operatorMap: Record<FilterOperator, symbol> = {
    [FilterOperator.EQUALS]: Op.eq,
    [FilterOperator.NOT_EQUALS]: Op.ne,
    [FilterOperator.GREATER_THAN]: Op.gt,
    [FilterOperator.LESS_THAN]: Op.lt,
    [FilterOperator.LIKE]: Op.like,
};

export class SequelizeCriteriaConverter {
    private readonly filters: Filters[];
    private readonly order: Order | undefined;
    private readonly offset: number | undefined;
    private readonly limit: number | undefined;

    constructor(readonly criteria: Criteria) {
        this.filters = criteria.filters;
        this.order = criteria.order;
        this.offset = criteria.offset;
        this.limit = criteria.limit;
    }

    public build(): {
        where: Record<string, any>;
        order: SequelizeOrder | undefined;
        offset: number | undefined;
        limit: number | undefined;
    } {
        return {
            where: this.buildSequelizeWhere(),
            order: this.buildSequelizeOrder(),
            offset: this.offset,
            limit: this.limit,
        };
    }

    private buildSequelizeWhere(): Record<string, any> {
        const where: Record<string, any> = {};

        this.filters.forEach((filter) => {
            const field = filter.field;
            const operator = filter.operator;
            const value = filter.value;

            if (!operatorMap[operator]) {
                throw new Error(`Not supported operator: ${operator}`);
            }

            if (!where[field]) {
                where[field] = {};
            }

            where[field][operatorMap[operator]] = value;
        });

        return where;
    }

    private buildSequelizeOrder(): SequelizeOrder | undefined {
        if (!this.order || this.order.isNone()) {
            return undefined;
        }

        const orderBy = this.order.orderBy;
        const orderType = this.order.orderType;

        if (!orderBy || orderType === OrderType.NONE) {
            return undefined;
        }

        return [[orderBy, orderType]];
    }
}
