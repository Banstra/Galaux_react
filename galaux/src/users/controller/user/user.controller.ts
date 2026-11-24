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
import { ApiBody } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiBody({
    type: CreateUserDto,
  })

  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto).then(r => r);
  }
}
