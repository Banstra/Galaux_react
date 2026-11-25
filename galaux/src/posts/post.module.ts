import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostEntity } from '../typeorm/entities/Post.entity';
import { UserEntity } from '../typeorm/entities/User.entity';
import { LikeEntity } from '../typeorm/entities/Like.entity';

import { PostService } from './service/post.service';
import { PostController } from './controller/post.controller';

@Module({
    imports: [TypeOrmModule.forFeature([PostEntity, LikeEntity, UserEntity])],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService],
})
export class PostModule { }