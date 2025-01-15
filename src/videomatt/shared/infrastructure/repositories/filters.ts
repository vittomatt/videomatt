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
        private readonly field: FilterField,
        private readonly operator: FilterOperator,
        private readonly value: FilterValue
    ) {}

    getField(): FilterField {
        return this.field;
    }

    getOperator(): FilterOperator {
        return this.operator;
    }

    getValue(): FilterValue {
        return this.value;
    }
}
