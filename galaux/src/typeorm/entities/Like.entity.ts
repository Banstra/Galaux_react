import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './User.entity';
import { PostEntity } from './Post.entity';
import { CommentEntity } from './Comment.entity';

@Entity({ name: 'likes' })
export class LikeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => PostEntity, (post) => post.likes, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;

  @ManyToOne(() => CommentEntity, (comment) => comment.likes, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'comment_id' })
  comment: CommentEntity;

  @CreateDateColumn()
  created_at: Date;
}
