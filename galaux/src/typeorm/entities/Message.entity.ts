import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './User.entity';

@Entity({ name: 'messages' })
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.sentMessages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sender_id' })
  sender: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.receivedMessages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'receiver_id' })
  receiver: UserEntity;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  is_read: boolean;

  @CreateDateColumn()
  created_at: Date;
}
