import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  Query,
  Delete,
  Patch,
} from '@nestjs/common';
import { CreatePostDto } from '../dto/CreatePost.dto';
import { PostService } from '../service/post.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PostResponseDto } from '../dto/PostResponse.dto';
import { UpdatePostDto } from '../dto/UpdatePost.dto';


@Controller('post')
export class PostController {
  constructor(private readonly postsService: PostService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiBody({ type: CreatePostDto })
  @ApiOkResponse({ type: PostResponseDto })
  async create(@Request() req: any, @Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(req.user.id, createPostDto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async getFeed(
    @Query('page') page = 1,
    @Query('limit') limit = 20
  ) {
    return this.postsService.getFeed(Number(page), Number(limit));
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async toggleLike(@Request() req: any, @Param('id') postId: string) {
    return this.postsService.toggleLike(req.user.id, Number(postId));
  }
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiBody({ type: UpdatePostDto })
  async updatePost(
    @Request() req: any,
    @Param('id') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.updatePost(req.user.id, Number(postId), updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async deletePost(
    @Request() req: any,
    @Param('id') postId: string,
  ) {
    return this.postsService.deletePost(req.user.id, Number(postId));
  }
}