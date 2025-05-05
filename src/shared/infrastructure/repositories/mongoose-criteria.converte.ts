import { UnexpectedError } from '@shared/domain/errors/unexpected.error';
import { Criteria } from '@shared/domain/repositories/criteria';
import { FilterOperator, Filters } from '@shared/domain/repositories/filters';
import { Order, OrderType } from '@shared/domain/repositories/order';

type MongoFilter = Record<string, any>;

const operatorMap: Record<FilterOperator, string> = {
    [FilterOperator.EQUALS]: '$eq',
    [FilterOperator.NOT_EQUALS]: '$ne',
    [FilterOperator.GREATER_THAN]: '$gt',
    [FilterOperator.LESS_THAN]: '$lt',
    [FilterOperator.LIKE]: '$regex',
};

export class MongooseCriteriaConverter {
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
        query: MongoFilter;
        sort: Record<string, 1 | -1> | undefined;
        skip: number | undefined;
        limit: number | undefined;
    } {
        return {
            query: this.buildMongoWhere(),
            sort: this.buildMongoSort(),
            skip: this.offset,
            limit: this.limit,
        };
    }

    private buildMongoWhere(): MongoFilter {
        const query: MongoFilter = {};

        this.filters.forEach((filter) => {
            const { field, operator, value } = filter;

            const mongoOperator = operatorMap[operator];
            if (!mongoOperator) {
                throw new UnexpectedError(`Not supported operator: ${operator}`);
            }

            if (operator === FilterOperator.LIKE && typeof value === 'string') {
                query[field] = { [mongoOperator]: new RegExp(value, 'i') };
            } else {
                query[field] = { [mongoOperator]: value };
            }
        });

        return query;
    }

    private buildMongoSort(): Record<string, 1 | -1> | undefined {
        if (!this.order || this.order.isNone()) {
            return;
        }

        const orderBy = this.order.orderBy;
        const orderType = this.order.orderType;

        if (!orderBy || orderType === OrderType.NONE) {
            return;
        }

        return {
            [orderBy]: orderType === OrderType.ASC ? 1 : -1,
        };
    }
}
