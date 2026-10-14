import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { PostEntity } from '../typeorm/entities/Post.entity';
import { CommentEntity } from '../typeorm/entities/Comment.entity';
import { LikeEntity } from '../typeorm/entities/Like.entity';
import { FriendshipEntity } from '../typeorm/entities/Friendship.entity';
import { MessageEntity } from '../typeorm/entities/Message.entity';
import { UserEntity } from '../typeorm/entities/User.entity';

// Services
import {PostService } from '../posts/post/post.service';
import { FriendshipService } from '../friendships/friendship/friendship.service';
import { MessageService } from '../message/message.service';

// Controllers
import { PostController } from '../posts/post/post.controller';
import { FriendshipController } from '../friendships/friendship/friendship.controller';
import { MessageController } from '../message/message.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostEntity,
      CommentEntity,
      LikeEntity,
      FriendshipEntity,
      MessageEntity,
      UserEntity, // Needed to resolve relations
    ]),
  ],
  providers: [PostService, FriendshipService, MessageService],
  controllers: [PostController, FriendshipController, MessageController],
  exports: [PostService, FriendshipService, MessageService],
})
export class SocialModule {}
