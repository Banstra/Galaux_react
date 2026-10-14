import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from '../../dto/CreateUser.dto';
import { UserService } from '../../service/user/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}



  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto).then(r => r);
  }
}
