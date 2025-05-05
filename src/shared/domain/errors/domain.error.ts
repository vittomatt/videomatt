import { ExpectedError } from '@shared/domain/errors/expected.error';

export abstract class DomainError extends ExpectedError {
    constructor(
        public readonly type: string,
        message: string
    ) {
        super(message);
    }

    toPrimitives(): {
        type: string;
        description: string;
        data: Record<string, unknown>;
    } {
        const props = Object.entries(this).filter(([key]) => key !== 'type' && key !== 'message');

        return {
            type: this.type,
            description: this.message,
            data: props.reduce((acc, [key, value]) => {
                return {
                    ...acc,
                    [key]: value,
                };
            }, {}),
        };
    }
}
