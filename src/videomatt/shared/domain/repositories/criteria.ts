import { Filters } from '@videomatt/shared/domain/repositories/filters';
import { Order, OrderType } from '@videomatt/shared/domain/repositories/order';

export class Criteria {
    private constructor(
        public filters: Filters[] = [],
        public order: Order = Order.create(OrderType.NONE),
        public offset?: number,
        public limit?: number,
        public include?: string[]
    ) {}

    static create(): Criteria {
        return new Criteria();
    }

    addFilter(filter: Filters): this {
        this.filters.push(filter);
        return this;
    }

    setOrder(order: Order): this {
        this.order = order;
        return this;
    }

    setOffset(offset: number): this {
        this.offset = offset;
        return this;
    }

    setLimit(limit: number): this {
        this.limit = limit;
        return this;
    }

    setInclude(include: string[]): this {
        this.include = include;
        return this;
    }
}
