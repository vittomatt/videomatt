import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetVideosParamValidatorDto {
    @IsUUID()
    @IsNotEmpty()
    userId!: string;
}
