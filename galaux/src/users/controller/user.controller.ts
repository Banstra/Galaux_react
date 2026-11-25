import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/CreateUser.dto';
import { UserService } from '../service/user.service';
import { ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from '../dto/UpdateUse.dto';

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
  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiBody({ type: UpdateUserDto })
  async updateProfile(
    @Request() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateProfile(req.user.id, updateUserDto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.userService.findAll(Number(page), Number(limit));
  }

  @Get('search')
  @ApiQuery({ name: 'q', required: true, description: 'Поисковый запрос по нику', example: 'test' })
  async search(@Query('q') query: string) {
    return this.userService.searchByUsername(query);
  }
}
