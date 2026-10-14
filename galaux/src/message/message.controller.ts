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
import { MessageService } from './message.service';
import { CreateMessageDto } from './CreateMessage.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async send(@Request() req: any, @Body() dto: CreateMessageDto) {
    return this.messageService.sendMessage(req.user.id, dto);
  }

  @Get('conversation/:otherUserId')
  @UseGuards(JwtAuthGuard)
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
  async markAsRead(@Request() req: any, @Param('id') messageId: string) {
    return this.messageService.markAsRead(req.user.id, Number(messageId));
  }
}
