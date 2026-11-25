import { IsString, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'Текст поста',
    example: 'Мой первый пост!'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;

  @ApiProperty({
    description: 'Ссылка на картинку (опционально)',
    example: 'https://example.com/image.png',
    required: false
  })
  @IsString()
  @IsOptional()
  image_url?: string;

  @ApiProperty({
    description: 'ID сервера (опционально)',
    example: 1,
    required: false
  })
  @IsOptional()
  server_id?: number;
}