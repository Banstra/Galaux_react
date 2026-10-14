import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany, OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './User.entity';
import { McversionEntity } from './Mcversion.entity';
import { ModEntity } from './Mod.entity';
import { ShopEntity } from './Shop.entity';
import { PostEntity } from './Post.entity';

@Entity({ name: 'servers' })
export class ServerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => UserEntity, (user) => user.server, { onDelete: 'CASCADE' })
  @JoinTable({name: 'server_owners',
  joinColumn: {name: 'user_id'},
  inverseJoinColumn: {name: 'server_id'}})
  creators: UserEntity[];

  @ManyToMany(() => UserEntity, (member) => member.followed_server)
  members: UserEntity[];

  @Column({ nullable: true })
  ip: string;

  @Column({ default: 0 })
  player_count: number;

  @Column({ default: false })
  status: boolean;

  @Column({ default: false })
  official: boolean;

  @ManyToOne(() => McversionEntity, (version) => version.server, {
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'mc_versions' })
  mc_version: McversionEntity;

  @ManyToMany(() => ModEntity, (mod) => mod.server, { onDelete: 'NO ACTION' })
  @JoinTable({
    name: 'server_mods',
    joinColumn: { name: 'server_id' },
    inverseJoinColumn: { name: 'mod_id' },
  })
  mod: ModEntity[];

  @OneToOne(() => ShopEntity, (shop) => shop.server, {
    onDelete: 'NO ACTION',
  })
  shop: ShopEntity;

  @OneToMany(() => PostEntity, (post) => post.server, {onDelete: "CASCADE", nullable: true})
  posts: PostEntity[]

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}