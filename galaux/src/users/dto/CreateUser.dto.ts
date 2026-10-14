import {
  IsEmail,
  IsNotEmpty,
  isStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;
  @MinLength(6, {message: 'Password must be more then 6 symbols'})
  password: string;
  @IsEmail()
  email: string;
}