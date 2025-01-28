import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateUserParamValidatorDto {
    @IsUUID()
    @IsNotEmpty()
    id!: string;
}

export class CreateUserBodyValidatorDto {
    @IsString()
    @IsNotEmpty()
    firstName!: string;

    @IsString()
    @IsNotEmpty()
    lastName!: string;
}
