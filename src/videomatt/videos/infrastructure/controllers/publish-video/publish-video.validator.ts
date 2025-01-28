import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class PublishVideoParamValidatorDto {
    @IsUUID()
    @IsNotEmpty()
    id!: string;
}

export class PublishVideoBodyValidatorDto {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsString()
    @IsNotEmpty()
    url!: string;

    @IsUUID()
    @IsNotEmpty()
    userId!: string;
}
