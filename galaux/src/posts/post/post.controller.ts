import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from './CreatePost.dto';
import { PostService } from './post.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('post')
export class PostController {
  constructor(private readonly postsService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req: any, @Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(req.user.id, createPostDto);
  }

  @Get()
  async getFeed(@Param('page') page = 1, @Param('limit') limit = 20) {
    return this.postsService.getFeed(Number(page), Number(limit));
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  async toggleLike(@Request() req: any, @Param('id') postId: string) {
    return this.postsService.toggleLike(req.user.id, Number(postId));
  }
}
