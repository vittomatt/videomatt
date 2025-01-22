export type FilterValue = string | number | boolean;

export type FilterField = string;

export enum FilterOperator {
    EQUALS = 'EQUALS',
    NOT_EQUALS = 'NOT_EQUALS',
    GREATER_THAN = 'GREATER_THAN',
    LESS_THAN = 'LESS_THAN',
    LIKE = 'LIKE',
}

export class Filters {
    constructor(
        public readonly field: FilterField,
        public readonly operator: FilterOperator,
        public readonly value: FilterValue
    ) {}
}
