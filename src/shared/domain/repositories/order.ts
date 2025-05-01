export type OrderBy = string;

export enum OrderType {
    ASC = 'ASC',
    DESC = 'DESC',
    NONE = 'NONE',
}

export class Order {
    private constructor(
        public orderBy: OrderBy | null = null,
        public orderType: OrderType = OrderType.NONE
    ) {}

    static create(orderBy: OrderBy | null = null, orderType: OrderType = OrderType.NONE): Order {
        return new Order(orderBy, orderType);
    }

    isNone(): boolean {
        return this.orderType === OrderType.NONE;
    }
}
