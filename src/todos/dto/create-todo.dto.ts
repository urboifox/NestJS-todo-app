import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTodoDto {
    @IsString()
    @MinLength(2, {
        message: 'Content must be at least 2 characters',
    })
    content: string;

    @IsBoolean()
    @IsOptional()
    completed: boolean;

    @IsString()
    userId: string;
}
