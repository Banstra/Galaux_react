import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  FriendshipEntity,
  FriendshipStatus,
} from '../../typeorm/entities/Friendship.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../typeorm/entities/User.entity';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(FriendshipEntity)
    private friendshipRepo: Repository<FriendshipEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) { }

  async deleteFriend(userId: number, friendId: number) {
    if (userId === friendId) {
      throw new BadRequestException('You cannot delete yourself from friends list');
    }

    const existing = await this.friendshipRepo.findOne({
      where: [
        { requester: { id: userId }, addressee: { id: friendId } },
        { requester: { id: friendId }, addressee: { id: userId } },
      ],
    });

    if (!existing) {
      throw new NotFoundException('Friendship not found');
    }

    if (existing.status !== FriendshipStatus.ACCEPTED) {
      throw new BadRequestException('You are not friends yet');
    }


    await this.friendshipRepo.remove(existing);

    return { message: 'Friend deleted successfully' };
  }

  async sendRequest(requesterId: number, addresseeId: number) {
    if (requesterId === addresseeId) {
      throw new BadRequestException('You cannot friend yourself');
    }

    const existing = await this.friendshipRepo.findOne({
      where: [
        { requester: { id: requesterId }, addressee: { id: addresseeId } },
        { requester: { id: addresseeId }, addressee: { id: requesterId } },
      ],
    });

    if (existing) {
      throw new BadRequestException(
        'Friendship request already exists or you are already friends',
      );
    }

    const requester = await this.userRepo.findOne({
      where: { id: requesterId },
    });

    if (!requester) {
      throw new NotFoundException(`Requester with ID ${requesterId} not found`);
    }

    const addressee = await this.userRepo.findOne({
      where: { id: addresseeId },
    });

    if (!addressee) {
      throw new NotFoundException(`Addressee with ID ${addresseeId} not found`);
    }

    const friendship = this.friendshipRepo.create({
      requester,
      addressee,
      status: FriendshipStatus.PENDING,
    });
    return this.friendshipRepo.save(friendship);
  }

  async updateStatus(
    requesterId: number,
    addresseeId: number,
    status: FriendshipStatus,
  ) {
    const friendship = await this.friendshipRepo.findOne({
      where: { requester: { id: requesterId }, addressee: { id: addresseeId } },
    });

    if (!friendship)
      throw new NotFoundException('Friendship request not found');

    friendship.status = status;
    return this.friendshipRepo.save(friendship);
  }

  async getFriends(userId: number, page = 1, limit = 20) {
    const friendships = await this.friendshipRepo
      .createQueryBuilder('friendship')
      .innerJoinAndSelect('friendship.requester', 'requester')
      .innerJoinAndSelect('friendship.addressee', 'addressee')
      .where('friendship.status = :status', {
        status: FriendshipStatus.ACCEPTED,
      })
      .andWhere('requester.id = :userId OR addressee.id = :userId', { userId })
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return friendships.map((f) =>
      f.requester.id === userId ? f.addressee : f.requester,
    );
  }
}
