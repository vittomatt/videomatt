import { Filters } from './filters';
import { Order, OrderType } from './order';

export class Criteria {
    constructor(
        private filters: Filters[] = [],
        private order: Order = new Order(OrderType.NONE),
        private offset?: number,
        private limit?: number
    ) {}

    getFilters(): Filters[] {
        return this.filters;
    }

    getOrder(): Order {
        return this.order;
    }

    getOffset(): number | undefined {
        return this.offset;
    }

    getLimit(): number | undefined {
        return this.limit;
    }

    addFilter(filter: Filters): void {
        this.filters.push(filter);
    }

    setOrder(order: Order): void {
        this.order = order;
    }

    static create(): Criteria {
        return new Criteria();
    }
}
