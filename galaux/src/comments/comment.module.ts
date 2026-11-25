import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from '../comments/controller/comment.controller';
import { CommentService } from '../comments/service/comment.service';
import { CommentEntity } from '../typeorm/entities/Comment.entity';
import { PostEntity } from '../typeorm/entities/Post.entity';
import { UserEntity } from '../typeorm/entities/User.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([CommentEntity, PostEntity, UserEntity]),
    ],
    controllers: [CommentController],
    providers: [CommentService],
})
export class CommentModule { }