import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Patch,
  Get,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import {
  FriendshipActionDto,
  UpdateFriendshipDto,
} from './FriendshipAction.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipsService: FriendshipService) { }

  @Post('request')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiBody({
    type: FriendshipActionDto,
    description: 'Добавление в друзья'
  })
  async sendRequest(@Request() req: any, @Body() dto: FriendshipActionDto) {
    return this.friendshipsService.sendRequest(req.user.id, dto.addressee_id);
  }

  @Patch(':requesterId/respond')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async respond(
    @Request() req: any,
    @Param('requesterId') requesterId: string,
    @Body() dto: UpdateFriendshipDto,
  ) {
    if (!requesterId || isNaN(Number(requesterId))) {
      throw new BadRequestException('Invalid requesterId');
    }
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('User not found in token');
    }

    return this.friendshipsService.updateStatus(
      Number(requesterId),
      req.user.id,
      dto.status,
    );
  }

  @Get('my-friends')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async getFriends(@Request() req: any) {
    return this.friendshipsService.getFriends(req.user.id);
  }
}
