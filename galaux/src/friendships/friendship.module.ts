import { Module } from '@nestjs/common';
import { FriendshipService } from './service/friendship.service';
import { FriendshipController } from './controller/friendship.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendshipEntity } from '../typeorm/entities/Friendship.entity';
import { UserEntity } from '../typeorm/entities/User.entity';

@Module({
  imports: [

    TypeOrmModule.forFeature([FriendshipEntity, UserEntity]),
  ],
  providers: [FriendshipService],
  controllers: [FriendshipController]
})
export class FriendshipModule { }
