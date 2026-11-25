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
  Delete,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FriendshipService } from '../service/friendship.service';
import {
  UpdateFriendshipDto,
} from '../dto/UpdateFriendship.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { UserResponseDto } from '../../auth/dto/UserResponse.dto';
@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipsService: FriendshipService) { }

  @Post('request/:addresseeId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiParam({ name: 'addresseeId', description: 'ID пользователя, которому отправляем запрос', example: 2 })
  async sendRequest(
    @Request() req: any,
    @Param('addresseeId', ParseIntPipe) addresseeId: number,
  ) {
    return this.friendshipsService.sendRequest(req.user.id, addresseeId);
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

  @Delete(':friendId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async deleteFriend(
    @Request() req: any,
    @Param('friendId') friendId: string,
  ) {
    return this.friendshipsService.deleteFriend(
      req.user.id,
      Number(friendId)
    );
  }


  @Get('my-friends')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiOkResponse({ type: [UserResponseDto] })
  async getFriends(
    @Request() req: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.friendshipsService.getFriends(req.user.id, page, limit);
  }
}
