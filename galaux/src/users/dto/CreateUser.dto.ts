import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Имя пользователя',
    example: 'testUser123',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Пароль пользователя (минимум 6 символов)',
    example: 'mySecretPassword123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'Password must be more then 6 symbols' })
  password: string;

  @ApiProperty({
    description: 'Электронная почта пользователя',
    example: 'test@example.com',
  })
  @IsEmail()
  email: string;
}