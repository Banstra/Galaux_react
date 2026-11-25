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
import { PostService } from '../posts/service/post.service';
import { FriendshipService } from '../friendships/service/friendship.service';
import { MessageService } from '../message/service/message.service';

// Controllers
import { PostController } from '../posts/controller/post.controller';
import { FriendshipController } from '../friendships/controller/friendship.controller';
import { MessageController } from '../message/controller/message.controller';

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
export class SocialModule { }
