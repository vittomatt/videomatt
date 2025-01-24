import { Filters } from './filters';
import { Order, OrderType } from './order';

export class Criteria {
    private constructor(
        public filters: Filters[] = [],
        public order: Order = Order.create(OrderType.NONE),
        public offset?: number,
        public limit?: number
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
}
