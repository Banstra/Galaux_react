import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { McversionEntity } from './Mcversion.entity';

@Entity({ name: 'mod_engine_versions' })
export class VersionEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  version: string

  @OneToMany(() => McversionEntity, (mcversion) => mcversion.version)
  @JoinColumn()
  mcversion: McversionEntity[]
}
