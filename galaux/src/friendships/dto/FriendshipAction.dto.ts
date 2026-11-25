import { IsEnum, IsNumber } from 'class-validator';
import { FriendshipStatus } from '../../typeorm/entities/Friendship.entity';
import { ApiProperty } from '@nestjs/swagger';

export class FriendshipActionDto {
  @ApiProperty({
    description: 'ID пользователя, которому нужно отправить запрос',
    example: 2
  })
  @IsNumber()
  addressee_id: number;
}

export class UpdateFriendshipDto {
  @ApiProperty({
    description: 'Статус запроса',
    example: FriendshipStatus.ACCEPTED
  })
  @IsEnum(FriendshipStatus)
  status: FriendshipStatus; // 'accepted' or 'declined'
}
