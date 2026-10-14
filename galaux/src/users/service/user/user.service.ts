import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../../typeorm/entities/User.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../dto/CreateUser.dto';
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

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

    const token = this.jwtService.sign({ username: createUserDto.username });

    return { newUser, token };
  }

  async findOne(username: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { username } });
  }

  async findOrCreate(profile: Partial<UserEntity>): Promise<UserEntity> {
    // 1. Check if user already exists by Microsoft ID
    let user = await this.userRepository.findOne({
      where: { microsoftId: profile.microsoftId },
    });

    if (!user) {
      // 2. Fallback check: Does a local user exist with the same email address?
      user = await this.userRepository.findOne({
        where: { email: profile.email },
      });

      if (user) {
        // Link Microsoft profile to existing local account
        user.microsoftId = profile.microsoftId!;
        await this.userRepository.save(user);
      } else {
        // 3. Register a completely new user
        user = this.userRepository.create(profile);
        await this.userRepository.save(user);
      }
    }

    return user;
  }
}
