import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/service/user/user.service';
import { IUser } from '../utils/types';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (user) {
      const passwordMatch = await argon2.verify(user.password, password);
      if (passwordMatch) return user;
      else throw new BadRequestException('Password is incorrect');
    }
    throw new BadRequestException('User not found');
  }

  async login(user: IUser) {
    const {id, username} = user
    return {
      id, username, access_token: this.jwtService.sign({id: user.id, username: user.username})
    };
  }
}
