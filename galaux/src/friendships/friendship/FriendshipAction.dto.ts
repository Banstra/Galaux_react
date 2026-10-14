import { IsEnum, IsNumber } from 'class-validator';
import { FriendshipStatus } from '../../typeorm/entities/Friendship.entity';

export class FriendshipActionDto {
  @IsNumber()
  addressee_id: number;
}

export class UpdateFriendshipDto {
  @IsEnum(FriendshipStatus)
  status: FriendshipStatus; // 'accepted' or 'declined'
}
