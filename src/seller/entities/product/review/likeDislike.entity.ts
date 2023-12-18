// like-dislike.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { Review } from './review.entity';
import { Seller } from '../../seller.entity';

@Entity()
export class LikeDislike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: 'like' | 'dislike' | 'normal';

  @ManyToOne(type => Seller, (user) => user.likeDislike, {eager:true})
  seller: Seller;

  @ManyToOne(() => Review, review => review.likeDislikes)
  review: Review;
}
