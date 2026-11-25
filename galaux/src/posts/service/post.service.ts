import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dto/CreatePost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikeEntity } from '../../typeorm/entities/Like.entity';
import { PostEntity } from '../../typeorm/entities/Post.entity';
import { UserEntity } from '../../typeorm/entities/User.entity';
import { UpdatePostDto } from '../dto/UpdatePost.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepo: Repository<PostEntity>,
    @InjectRepository(LikeEntity)
    private likeRepo: Repository<LikeEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) { }

  async createPost(userId: number, createPostDto: CreatePostDto) {

    const author = await this.userRepo.findOne({ where: { id: userId } });
    if (!author) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const post = this.postRepo.create({
      ...createPostDto,
      author,
    });

    return this.postRepo.save(post);
  }

  async getFeed(page = 1, limit = 20) {
    const { entities, raw } = await this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoin('post.likes', 'like')
      .addSelect('COUNT(like.id)', 'likes_count')
      .orderBy('post.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .groupBy('post.id, author.id')
      .getRawAndEntities();

    return entities.map((post, index) => ({
      ...post,
      likes_count: Number(raw[index]?.likes_count) || 0,
    }));
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

  async updatePost(userId: number, postId: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: { author: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.author.id !== userId) {
      throw new ForbiddenException('You can only edit your own posts');
    }

    Object.assign(post, updatePostDto);
    return this.postRepo.save(post);
  }

  async deletePost(userId: number, postId: number) {
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: { author: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.author.id !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.postRepo.remove(post);
    return { message: 'Post deleted successfully' };
  }
}
