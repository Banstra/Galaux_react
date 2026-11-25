import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({ description: 'Отображаемое имя', required: false, example: 'Мое Имя' })
    @IsString()
    @IsOptional()
    @MaxLength(50)
    displayName?: string;

    @ApiProperty({ description: 'Информация о профиле', required: false, example: 'Люблю майнкрафт' })
    @IsString()
    @IsOptional()
    @MaxLength(500)
    profile_info?: string;

    @ApiProperty({ description: 'Telegram ссылка', required: false, example: 'https://t.me/username' })
    @IsString()
    @IsOptional()
    telegram_link?: string;

    @ApiProperty({ description: 'Discord ссылка', required: false, example: 'username#1234' })
    @IsString()
    @IsOptional()
    discord_link?: string;
}