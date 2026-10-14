import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ModEntity } from './Mod.entity';
import { ServerEntity } from './Server.entity';
import { VersionEntity } from './Version.entity';

@Entity({ name: 'mc_versions' })
export class McversionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  download_link: string;

  @Column({ default: false })
  release_version: boolean;

  @ManyToMany(() => ModEntity, (mod) => mod.mc_version, {
    onDelete: 'NO ACTION',
  })
  mod: ModEntity[];

  @OneToMany(() => ServerEntity, (server) => server.mc_version, {
    onDelete: 'NO ACTION',
  })
  @JoinColumn()
  server: ServerEntity;

  @ManyToOne(() => VersionEntity, (version) => version.mcversion)
  version: VersionEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
