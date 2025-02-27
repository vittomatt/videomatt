import { CommandHandlerMapping } from '@videomatt/shared/infrastructure/event-bus/command-handler-mapping';
import { QueryHandlerMapping } from '@videomatt/shared/infrastructure/event-bus/query-handler-mapping';

export interface BaseCommandDTO {
    type: keyof CommandHandlerMapping;
}

export interface BaseQueryDTO {
    type: keyof QueryHandlerMapping;
}

export class DTO {}
