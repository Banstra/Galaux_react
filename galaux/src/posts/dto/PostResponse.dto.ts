import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../auth/dto/UserResponse.dto';

@Exclude()
export class PostResponseDto {
    @Expose()
    @ApiProperty({ example: 1 })
    id: number;

    @Expose()
    @ApiProperty({ example: 'Мой первый пост!' })
    content: string;

    @Expose()
    @ApiProperty({ example: 'https://example.com/image.png', required: false })
    image_url: string;

    @Expose()
    @Type(() => UserResponseDto)
    @ApiProperty({ type: UserResponseDto })
    author: UserResponseDto;

    @Expose()
    @ApiProperty({ example: '2026-11-24T09:52:54.256Z' })
    created_at: Date;

    @Expose()
    @ApiProperty({ example: 10, description: 'Количество лайков' })
    likes_count: number;
}