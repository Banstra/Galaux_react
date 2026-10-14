import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { McversionEntity } from './Mcversion.entity';
import { ServerEntity } from './Server.entity';

@Entity({ name: 'mods' })
export class ModEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: true })
  private: boolean;

  @Column({ nullable: true })
  info: string;

  @Column()
  download_link: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => McversionEntity, (version) => version.mod, {
    onDelete: 'NO ACTION',
  })
  @JoinTable({
    name: 'mods_mc_versions',
    joinColumn: {name: 'mod_id'},
    inverseJoinColumn: {name: 'mc_version_id'}
  })
  mc_version: McversionEntity[];

  @ManyToMany(() => ServerEntity, (server) => server.mod, {
    onDelete: 'NO ACTION',
  })
  server: ServerEntity[];
}