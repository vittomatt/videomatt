import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AddCommentToVideoParamValidatorDto {
    @IsUUID()
    @IsNotEmpty()
    videoId!: string;

    @IsUUID()
    @IsNotEmpty()
    commentId!: string;
}

export class AddCommentToVideoBodyValidatorDto {
    @IsString()
    @IsNotEmpty()
    text!: string;

    @IsUUID()
    @IsNotEmpty()
    userId!: string;
}
