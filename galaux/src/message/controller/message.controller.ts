import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from '../service/message.service';
import { CreateMessageDto } from '../dto/CreateMessage.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiProperty } from '@nestjs/swagger';


@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiBody({
    type: CreateMessageDto,
    description: 'Данные нового сообщения'
  })
  async send(@Request() req: any, @Body() dto: CreateMessageDto) {
    return this.messageService.sendMessage(req.user.id, dto);
  }

  @Get('conversation/:otherUserId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async getConversation(
    @Request() req: any,
    @Param('otherUserId') otherUserId: string,
  ) {
    return this.messageService.getConversation(
      req.user.id,
      Number(otherUserId),
    );
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async markAsRead(@Request() req: any, @Param('id') messageId: string) {
    return this.messageService.markAsRead(req.user.id, Number(messageId));
  }
}