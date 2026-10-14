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
  ) {}

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

    const requester = await this.userRepo.findOneOrFail({
      where: { id: requesterId },
    });
    const addressee = await this.userRepo.findOneOrFail({
      where: { id: addresseeId },
    });

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

  async getFriends(userId: number) {
    // Get all accepted friendships where the user is either requester or addressee
    const friendships = await this.friendshipRepo
      .createQueryBuilder('friendship')
      .innerJoinAndSelect('friendship.requester', 'requester')
      .innerJoinAndSelect('friendship.addressee', 'addressee')
      .where('friendship.status = :status', {
        status: FriendshipStatus.ACCEPTED,
      })
      .andWhere('requester.id = :userId OR addressee.id = :userId', { userId })
      .getMany();

    // Map to return just the "other" user's details
    return friendships.map((f) =>
      f.requester.id === userId ? f.addressee : f.requester,
    );
  }
}
