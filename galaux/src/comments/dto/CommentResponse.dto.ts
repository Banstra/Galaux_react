import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../auth/dto/UserResponse.dto';

@Exclude()
export class CommentResponseDto {
    @Expose()
    @ApiProperty({ example: 1 })
    id: number;

    @Expose()
    @ApiProperty({ example: 'Отличный пост!' })
    content: string;

    @Expose()
    @Type(() => UserResponseDto)
    @ApiProperty({ type: UserResponseDto })
    author: UserResponseDto;

    @Expose()
    @ApiProperty({ example: '2026-11-24T09:52:54.256Z' })
    created_at: Date;
}