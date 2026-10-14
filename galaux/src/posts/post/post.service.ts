import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './CreatePost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikeEntity } from '../../typeorm/entities/Like.entity';
import { PostEntity } from '../../typeorm/entities/Post.entity';
import { UserEntity } from '../../typeorm/entities/User.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepo: Repository<PostEntity>,
    @InjectRepository(LikeEntity)
    private likeRepo: Repository<LikeEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async createPost(userId: number, createPostDto: CreatePostDto) {
    // 1. Fetch the user
    const author = await this.userRepo.findOne({ where: { id: userId } });

    // 2. Check if author is null and throw a 404 error if they don't exist
    if (!author) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // 3. Now TypeScript knows `author` is definitely a UserEntity, so no more TS2769 error!
    const post = this.postRepo.create({
      ...createPostDto,
      author,
    });

    return this.postRepo.save(post);
  }

  async getFeed(page = 1, limit = 20) {
    // Using QueryBuilder to efficiently join author and like counts
    return this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoin('post.likes', 'like')
      .addSelect('COUNT(like.id)', 'likes_count')
      .orderBy('post.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .groupBy('post.id, author.id')
      .getRawAndEntities();
  }

  async toggleLike(userId: number, postId: number) {
    const existingLike = await this.likeRepo.findOne({
      where: { user: { id: userId }, post: { id: postId } },
    });

    if (existingLike) {
      await this.likeRepo.remove(existingLike);
      return { liked: false, message: 'Post unliked' };
    }

    const like = this.likeRepo.create({
      user: { id: userId },
      post: { id: postId },
    });
    await this.likeRepo.save(like);
    return { liked: true, message: 'Post liked' };
  }
}
