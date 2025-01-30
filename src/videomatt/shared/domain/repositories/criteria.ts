import { Order, OrderType } from './order';
import { Filters } from './filters';

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

    addFilter(filter: Filters): Criteria {
        this.filters.push(filter);
        return this;
    }

    setOrder(order: Order): Criteria {
        this.order = order;
        return this;
    }

    setOffset(offset: number): Criteria {
        this.offset = offset;
        return this;
    }

    setLimit(limit: number): Criteria {
        this.limit = limit;
        return this;
    }

    setInclude(include: string[]): Criteria {
        this.include = include;
        return this;
    }
}
