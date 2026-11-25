import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { RoleEntity } from '../../typeorm/entities/Role.entity';

@Exclude()
export class UserResponseDto {
    @Expose()
    @ApiProperty({ description: 'ID пользователя', example: 1 })
    id: number;

    @Expose()
    @ApiProperty({ description: 'Microsoft ID', example: null, required: false })
    microsoftId: string;

    @Expose()
    @ApiProperty({ description: 'Имя пользователя', example: 'testUser123' })
    username: string;

    @Expose()
    @ApiProperty({ description: 'Отображаемое имя', example: null, required: false })
    displayName: string;


    @Expose()
    @ApiProperty({ description: 'Email', example: 'test@example.com' })
    email: string;

    @Expose()
    @ApiProperty({ description: 'UUID', example: '0827b287-80a5-4d33-b1c4-0a379848ceea' })
    uuid: string;

    @Expose()
    @ApiProperty({ description: 'Информация профиля', example: null, required: false })
    profile_info: string;

    @Expose()
    @ApiProperty({ description: 'Дата создания', example: '2026-11-24T09:52:54.256Z' })
    created_at: Date;

    @Expose()
    @ApiProperty({ description: 'Дата обновления', example: '2026-11-24T09:52:54.256Z' })
    updated_at: Date;

    @Expose()
    @ApiProperty({ description: 'Оффлайн статус', example: true })
    offline: boolean;

    @Expose()
    @ApiProperty({ description: 'UUID Minecraft', example: null, required: false })
    minecraftUuid: string;

    @Expose()
    @ApiProperty({ description: 'Telegram ссылка', example: null, required: false })
    telegram_link: string;

    @Expose()
    @ApiProperty({ description: 'Discord ссылка', example: null, required: false })
    discord_link: string;

    @Expose()
    @ApiProperty({ description: 'Баланс', example: 0.0 })
    money: number;

    @Expose()
    @Type(() => RoleEntity)
    @ApiProperty({ type: () => RoleEntity, required: false })
    role: RoleEntity;
}