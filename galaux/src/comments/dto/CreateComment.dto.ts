import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
    @ApiProperty({
        description: 'Текст комментария',
        example: 'Отличный пост!',
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    content: string;
}