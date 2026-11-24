import { IsString, IsNotEmpty, IsNumber, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({
    description: 'ID пользователя, которому отправляется сообщение',
    example: 2
  })
  @IsNumber()
  receiver_id: number;

  @ApiProperty({
    description: 'Текст сообщения',
    example: 'Привет, как дела?',
    maxLength: 1000
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;
}