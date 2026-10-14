import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ModEntity } from './Mod.entity';
import { ShopEntity } from './Shop.entity';
import { UserEntity } from './User.entity';

@Entity({ name: 'products' })
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 0.0 })
  price: number;

  @Column({ default: false })
  active: boolean;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  icon_url: string;

  @ManyToOne(() => ShopEntity, (shop) => shop.product)
  @JoinColumn()
  shop: ShopEntity;

  @ManyToMany(() => UserEntity, (buyer) => buyer.product)
  @JoinTable({
    name: 'transactions',
    joinColumn: {name: 'user_id'},
    inverseJoinColumn: {name: 'product_id'}
  })
  buyer: UserEntity[]

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}