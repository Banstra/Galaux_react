import { ApiProperty } from "@nestjs/swagger";
import { CommentResponseDto } from "./CommentResponse.dto";

export class PaginatedCommentResponseDto {
    @ApiProperty({ type: [CommentResponseDto] })
    data: CommentResponseDto[];

    @ApiProperty({ example: 100 })
    total: number;

    @ApiProperty({ example: 1 })
    page: number;

    @ApiProperty({ example: 20 })
    limit: number;
}