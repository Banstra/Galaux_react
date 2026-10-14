import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from '../typeorm/entities/Message.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../typeorm/entities/User.entity';
import { CreateMessageDto } from './CreateMessage.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepo: Repository<MessageEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async sendMessage(senderId: number, createMessageDto: CreateMessageDto) {
    const sender = await this.userRepo.findOneOrFail({
      where: { id: senderId },
    });
    const receiver = await this.userRepo.findOneOrFail({
      where: { id: createMessageDto.receiver_id },
    });

    const message = this.messageRepo.create({
      sender,
      receiver,
      content: createMessageDto.content,
      is_read: false,
    });

    return this.messageRepo.save(message);
  }

  async getConversation(
    userId: number,
    otherUserId: number,
    page = 1,
    limit = 30,
  ) {
    return this.messageRepo
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .where(
        '(message.sender_id = :userId AND message.receiver_id = :otherUserId) OR (message.sender_id = :otherUserId AND message.receiver_id = :userId)',
        { userId, otherUserId },
      )
      .orderBy('message.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  async markAsRead(userId: number, messageId: number) {
    await this.messageRepo.update(
      { id: messageId, receiver: { id: userId } },
      { is_read: true },
    );
    return { success: true };
  }
}
