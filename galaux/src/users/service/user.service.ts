import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../typeorm/entities/User.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/CreateUser.dto';
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) { }

  async createUser(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (existUser) throw new BadRequestException('This email is already taken');
    const newUser = await this.userRepository.save({
      email: createUserDto.email,
      password: await argon2.hash(createUserDto.password),
      username: createUserDto.username,
    });

    // При регистрации также нужно записывать в токен id созданного только что юзера
    const token = this.jwtService.sign({ id: newUser.id, username: createUserDto.username });

    return { newUser, token };
  }

  async findOne(username: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { username } });
  }

  async findOrCreate(profile: any): Promise<UserEntity> {
    let user = await this.userRepository.findOne({
      where: { microsoftId: profile.microsoftId },
    });

    if (!user) {
      user = await this.userRepository.findOne({
        where: { email: profile.email },
      });

      if (user) {
        user.microsoftId = profile.microsoftId;
        if (!user.username) {
          user.username = profile.displayName || profile.email.split('@')[0];
        }
        await this.userRepository.save(user);
      } else {
        user = this.userRepository.create({
          microsoftId: profile.microsoftId,
          email: profile.email,
          username: profile.displayName || profile.email.split('@')[0],
          offline: false,
          money: 0.0,
        });
        await this.userRepository.save(user);
      }
    }
    return user;
  }
}
