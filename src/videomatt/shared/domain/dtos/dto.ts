import { CommandHandlerMapping } from '@videomatt/shared/infrastructure/event-bus/command-handler-mapping';

export interface BaseDTO {
    type: keyof CommandHandlerMapping;
}

export class DTO {}
