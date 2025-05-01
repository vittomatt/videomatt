import { Criteria } from '@shared/domain/repositories/criteria';
import { FilterOperator, Filters } from '@shared/domain/repositories/filters';
import { Order, OrderType } from '@shared/domain/repositories/order';
import { VideoCommentDBModel } from '@videos/video-comment/infrastructure/models/video-comment.db-model';

import { Op, Includeable as SequelizeIncludeable, Order as SequelizeOrder } from 'sequelize';

type FilterValue = string | number | boolean;

type WhereClause = Record<string, Record<symbol, FilterValue>>;

type Includes = SequelizeIncludeable;

const includeMap: Record<string, Includes> = {
    comments: VideoCommentDBModel,
};

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
    private readonly include: string[] | undefined;

    constructor(readonly criteria: Criteria) {
        this.filters = criteria.filters;
        this.order = criteria.order;
        this.offset = criteria.offset;
        this.limit = criteria.limit;
        this.include = criteria.include;
    }

    public build(): {
        where: WhereClause;
        order: SequelizeOrder | undefined;
        offset: number | undefined;
        limit: number | undefined;
        include: Includes[] | undefined;
    } {
        return {
            where: this.buildSequelizeWhere(),
            order: this.buildSequelizeOrder(),
            offset: this.offset,
            limit: this.limit,
            include: this.buildSequelizeInclude(),
        };
    }

    private buildSequelizeWhere(): WhereClause {
        const where: WhereClause = {};

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
            return;
        }

        const orderBy = this.order.orderBy;
        const orderType = this.order.orderType;

        if (!orderBy || orderType === OrderType.NONE) {
            return;
        }

        return [[orderBy, orderType]];
    }

    private buildSequelizeInclude(): Includes[] | undefined {
        if (!this.include) {
            return;
        }

        const allIncludes: Includes[] = [];

        this.include.forEach((include) => {
            if (!includeMap[include]) {
                throw new Error(`Not supported include: ${include}`);
            }

            allIncludes.push(includeMap[include]);
        });

        return allIncludes;
    }
}
