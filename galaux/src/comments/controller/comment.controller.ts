import {
    Controller,
    Post,
    Get,
    Delete,
    Body,
    Param,
    Query,
    Request,
    UseGuards,
    ParseIntPipe,
    DefaultValuePipe,
} from '@nestjs/common';
import { CommentService } from '../service/comment.service';
import { CreateCommentDto } from '../dto/CreateComment.dto';
import { CommentResponseDto } from '../dto/CommentResponse.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PaginatedCommentResponseDto } from '../dto/PaginatedCommentResponse.dto';
import {
    ApiBearerAuth,
    ApiBody,
    ApiOkResponse,
    ApiParam,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) { }

    @Post(':postId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiParam({ name: 'postId', description: 'ID поста', example: 1 })
    @ApiBody({ type: CreateCommentDto })
    @ApiOkResponse({ type: CommentResponseDto })
    async createComment(
        @Request() req: any,
        @Param('postId', ParseIntPipe) postId: number,
        @Body() dto: CreateCommentDto,
    ) {
        return this.commentService.createComment(req.user.id, postId, dto);
    }

    @Get('post/:postId')
    @ApiParam({ name: 'postId', description: 'ID поста', example: 1 })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 20 })
    @ApiOkResponse({ type: PaginatedCommentResponseDto })
    async getComments(
        @Param('postId', ParseIntPipe) postId: number,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    ) {
        return this.commentService.getCommentsByPost(postId, page, limit);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    @ApiParam({ name: 'id', description: 'ID комментария', example: 1 })
    async deleteComment(
        @Request() req: any,
        @Param('id', ParseIntPipe) commentId: number,
    ) {
        return this.commentService.deleteComment(req.user.id, commentId);
    }
}