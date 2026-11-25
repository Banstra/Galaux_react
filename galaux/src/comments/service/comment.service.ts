import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from '../../typeorm/entities/Comment.entity';
import { PostEntity } from '../../typeorm/entities/Post.entity';
import { UserEntity } from '../../typeorm/entities/User.entity';
import { CreateCommentDto } from '../dto/CreateComment.dto';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntity)
        private commentRepo: Repository<CommentEntity>,
        @InjectRepository(PostEntity)
        private postRepo: Repository<PostEntity>,
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,
    ) { }

    async createComment(userId: number, postId: number, dto: CreateCommentDto) {
        const post = await this.postRepo.findOne({ where: { id: postId } });
        if (!post) {
            throw new NotFoundException(`Post with ID ${postId} not found`);
        }

        const author = await this.userRepo.findOne({ where: { id: userId } });
        if (!author) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const comment = this.commentRepo.create({
            content: dto.content,
            post,
            author,
        });

        return this.commentRepo.save(comment);
    }

    async getCommentsByPost(postId: number, page = 1, limit = 20) {
        const postExists = await this.postRepo.exists({ where: { id: postId } });
        if (!postExists) {
            throw new NotFoundException(`Post with ID ${postId} not found`);
        }

        const [comments, total] = await this.commentRepo.findAndCount({
            where: { post: { id: postId } },
            relations: { author: true },
            order: { created_at: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });

        return { data: comments, total, page, limit };
    }

    async deleteComment(userId: number, commentId: number) {
        const comment = await this.commentRepo.findOne({
            where: { id: commentId },
            relations: { author: true },
        });

        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

        if (comment.author.id !== userId) {
            throw new ForbiddenException('You can only delete your own comments');
        }

        await this.commentRepo.remove(comment);
        return { message: 'Comment deleted successfully' };
    }
}