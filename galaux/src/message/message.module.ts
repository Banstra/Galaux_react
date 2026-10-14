import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessageEntity } from '../typeorm/entities/Message.entity';
import { UserEntity } from '../typeorm/entities/User.entity';

import { MessageService } from './message.service';
import { MessageController } from './message.controller';

@Module({
  imports: [

    TypeOrmModule.forFeature([MessageEntity, UserEntity]),
  ],
  providers: [MessageService],
  controllers: [MessageController],
  exports: [MessageService],
})
export class MessageModule {}
