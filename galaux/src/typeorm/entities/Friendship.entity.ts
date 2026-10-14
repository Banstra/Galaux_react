import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './User.entity';

export enum FriendshipStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  BLOCKED = 'blocked',
}

@Entity({ name: 'friendships' })
export class FriendshipEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.sentFriendRequests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'requester_id' })
  requester: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.receivedFriendRequests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'addressee_id' })
  addressee: UserEntity;

  @Column({
    type: 'enum',
    enum: FriendshipStatus,
    default: FriendshipStatus.PENDING,
  })
  status: FriendshipStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
