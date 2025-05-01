import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateVideoParamValidatorDto {
    @IsUUID()
    @IsNotEmpty()
    videoId!: string;
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

    @IsUUID()
    @IsNotEmpty()
    userId!: string;
}
