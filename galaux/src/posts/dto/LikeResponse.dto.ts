import { ApiProperty } from "@nestjs/swagger";

export class LikeResponseDto {
    @ApiProperty({ example: true })
    liked: boolean;

    @ApiProperty({ example: 'Post liked' })
    message: string;
}