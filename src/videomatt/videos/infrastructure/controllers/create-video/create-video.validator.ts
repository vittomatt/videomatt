import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateVideoParamValidatorDto {
    @IsUUID()
    @IsNotEmpty()
    id!: string;
}

export class CreateVideoBodyValidatorDto {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsString()
    @IsNotEmpty()
    url!: string;
}
