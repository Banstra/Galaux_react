import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleEntity } from './Role.entity';
import { ServerEntity } from './Server.entity';
import { ProductEntity } from './Product.entity';
import { PostEntity } from './Post.entity';
import { CommentEntity } from './Comment.entity';
import { LikeEntity } from './Like.entity';
import { FriendshipEntity } from './Friendship.entity';
import { MessageEntity } from './Message.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  microsoftId: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  displayName: string;

  @Column({ nullable: true })
  password: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ nullable: true })
  profile_info: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: true })
  offline: boolean;

  @Column({ nullable: true })
  accessToken: string; // For Microsoft/Minecraft launcher tokens later

  @Column({ nullable: true })
  refreshToken: string;

  @ManyToOne(() => RoleEntity, (role) => role.user, { onDelete: 'CASCADE' })
  @JoinColumn()
  role: RoleEntity;

  @ManyToMany(() => ServerEntity, (server) => server.creators, {
    onDelete: 'CASCADE',
  })
  server: ServerEntity;

  @ManyToMany(() => ServerEntity, (followed_server) => followed_server.members)
  @JoinTable({
    name: 'followed_servers',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'server_id' },
  })
  followed_server: ServerEntity[];

  // Добавь это поле в класс UserEntity
  @Column({ unique: true, nullable: true })
  minecraftUuid: string; // UUID, который выдает Mojang (или сгенерированный для оффлайн)

  @Column({ unique: true, nullable: true })
  telegram_link: string;

  @Column({ unique: true, nullable: true })
  discord_link: string;

  @Column({ default: 0.0 })
  money: number;

  @ManyToMany(() => ProductEntity, (product) => product.buyer)
  product: ProductEntity[];

  @OneToMany(() => PostEntity, (post) => post.author)
  posts: PostEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.author)
  comments: CommentEntity[];

  @OneToMany(() => LikeEntity, (like) => like.user)
  likes: LikeEntity[];

  @OneToMany(() => FriendshipEntity, (friendship) => friendship.requester)
  sentFriendRequests: FriendshipEntity[];

  @OneToMany(() => FriendshipEntity, (friendship) => friendship.addressee)
  receivedFriendRequests: FriendshipEntity[];

  @OneToMany(() => MessageEntity, (message) => message.sender)
  sentMessages: MessageEntity[];

  @OneToMany(() => MessageEntity, (message) => message.receiver)
  receivedMessages: MessageEntity[];
}
