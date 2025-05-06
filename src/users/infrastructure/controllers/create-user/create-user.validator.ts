import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateUserParamValidatorDto {
    @IsUUID()
    @IsNotEmpty()
    userId!: string;
}

export class CreateUserBodyValidatorDto {
    @IsString()
    @IsNotEmpty()
    firstName!: string;

    @IsString()
    @IsNotEmpty()
    lastName!: string;
}
