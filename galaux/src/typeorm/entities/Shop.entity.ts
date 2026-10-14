import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ServerEntity } from './Server.entity';
import { ModEntity } from './Mod.entity';
import { ProductEntity } from './Product.entity';

@Entity({ name: 'shops' })
export class ShopEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  active: boolean;

  @OneToOne(() => ServerEntity, (server) => server.shop, {
    onDelete: 'NO ACTION',
  })
  server: ServerEntity;

  @OneToMany(() => ProductEntity, (product) => product.shop, {onDelete: "CASCADE"})
  product: ProductEntity[]

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}