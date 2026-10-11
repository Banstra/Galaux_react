import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../typeorm/entities/User';
import { Repository } from 'typeorm';
import { CreateUserParams } from '../../../utils/types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  findUsers() {}

  async findByMicrosoftId(microsoftId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { microsoftId } });
  }
  async findByLogin(login: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { login } });
  }
  createUser(userDetails: CreateUserParams) {
    const newUser = this.userRepository.create({ ...userDetails });
    return this.userRepository.save(newUser);
  }

  async updateTokens(
    microsoftId: string,
    accessToken: string,
    refreshToken: string,
  ) {
    return this.userRepository.update(
      { microsoftId },
      { accessToken, refreshToken },
    );
  }
}
