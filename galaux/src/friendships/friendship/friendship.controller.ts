import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Patch,
  Get,
} from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import {
  FriendshipActionDto,
  UpdateFriendshipDto,
} from './FriendshipAction.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipsService: FriendshipService) {}

  @Post('request')
  @UseGuards(JwtAuthGuard)
  async sendRequest(@Request() req: any, @Body() dto: FriendshipActionDto) {
    return this.friendshipsService.sendRequest(req.user.id, dto.addressee_id);
  }

  @Patch(':requesterId/respond')
  @UseGuards(JwtAuthGuard)
  async respond(
    @Request() req: any,
    @Param('requesterId') requesterId: string,
    @Body() dto: UpdateFriendshipDto,
  ) {
    return this.friendshipsService.updateStatus(
      Number(requesterId),
      req.user.id,
      dto.status,
    );
  }

  @Get('my-friends')
  @UseGuards(JwtAuthGuard)
  async getFriends(@Request() req: any) {
    return this.friendshipsService.getFriends(req.user.id);
  }
}
