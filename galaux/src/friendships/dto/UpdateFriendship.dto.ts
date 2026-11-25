import { IsEnum } from 'class-validator';
import { FriendshipStatus } from '../../typeorm/entities/Friendship.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFriendshipDto {
  @ApiProperty({
    description: 'Статус запроса',
    example: FriendshipStatus.ACCEPTED
  })
  @IsEnum(FriendshipStatus)
  status: FriendshipStatus; // 'accepted' or 'declined'
}
