export type OrderBy = string;

export enum OrderType {
    ASC = 'ASC',
    DESC = 'DESC',
    NONE = 'NONE',
}

export class Order {
    constructor(
        private orderBy: OrderBy | null = null,
        private orderType: OrderType = OrderType.NONE
    ) {}

    getOrderBy(): OrderBy | null {
        return this.orderBy;
    }

    getOrderType(): OrderType {
        return this.orderType;
    }

    isNone(): boolean {
        return this.orderType === OrderType.NONE;
    }
}
