import { IsString, IsNotEmpty, IsNumber, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsNumber()
  receiver_id: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;
}
