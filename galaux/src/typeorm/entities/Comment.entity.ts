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
import { PostEntity } from './Post.entity';
import { LikeEntity } from './Like.entity';

@Entity({ name: 'comments' })
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => UserEntity, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  @ManyToOne(() => PostEntity, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;

  @OneToMany(() => LikeEntity, (like) => like.comment)
  likes: LikeEntity[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
