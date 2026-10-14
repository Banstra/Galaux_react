import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import {TypeOrmModule} from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserEntity } from './typeorm/entities/User.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import {ConfigModule, ConfigService } from '@nestjs/config';
import { RoleEntity } from './typeorm/entities/Role.entity';
import { MessageController } from './message/message.controller';
import { MessageModule } from './message/message.module';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [__dirname + '/typeorm/entities/**'],
        synchronize: true,
      }),
      inject: [ConfigService]
    }),
    UsersModule,
    AuthModule,
    MessageModule,
  ],
  controllers: [AppController, MessageController],
  providers: [AppService],
})
export class AppModule {}
