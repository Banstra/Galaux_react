import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  microsoftId: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true, nullable: true })
  login: string;

  @Column({ nullable: true })
  password: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ nullable: true })
  profile_info: string;

  @Column({ unique: true, nullable: true })
  discord_link: string;

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

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;
}