import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './User.entity';

@Entity({name: 'roles'})
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;


  @OneToMany(() => UserEntity, (user) => user.role, {onDelete: "CASCADE"})
  @JoinColumn({name: 'user_id'})
  user: UserEntity[]
  
}