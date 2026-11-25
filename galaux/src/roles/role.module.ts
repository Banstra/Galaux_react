import { Module } from '@nestjs/common';
import { RoleController } from './controller/role.controller';
import { RoleService } from './service/role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from '../typeorm/entities/Role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  controllers: [RoleController],
  providers: [RoleService]
})
export class RoleModule { }
