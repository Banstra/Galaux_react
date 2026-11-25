import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
    @ApiProperty({
        description: 'Новый текст поста',
        example: 'Обновленный текст поста',
        required: false
    })
    @IsString()
    @IsOptional()
    @MaxLength(2000)
    content?: string;

    @ApiProperty({
        description: 'Ссылка на новую картинку',
        example: 'https://example.com/new-image.png',
        required: false
    })
    @IsString()
    @IsOptional()
    image_url?: string;
}