export type OrderBy = string;

export enum OrderType {
    ASC = 'ASC',
    DESC = 'DESC',
    NONE = 'NONE',
}

export class Order {
    constructor(
        public orderBy: OrderBy | null = null,
        public orderType: OrderType = OrderType.NONE
    ) {}

    isNone(): boolean {
        return this.orderType === OrderType.NONE;
    }
}
