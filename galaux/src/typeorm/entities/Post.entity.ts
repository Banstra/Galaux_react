import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './User.entity';
import { ServerEntity } from './Server.entity';
import { CommentEntity } from './Comment.entity';
import { LikeEntity } from './Like.entity';

@Entity({ name: 'posts' })
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  image_url: string;

  @ManyToOne(() => UserEntity, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  // Optional: Link post to a specific server (e.g., server news feed)
  @ManyToOne(() => ServerEntity, (server) => server.posts, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'server_id' })
  server: ServerEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.post, { cascade: true })
  comments: CommentEntity[];

  @OneToMany(() => LikeEntity, (like) => like.post)
  likes: LikeEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
