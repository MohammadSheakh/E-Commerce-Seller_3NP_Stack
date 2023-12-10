// like-dislike.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { Review } from './review.entity';
import { Seller } from '../../seller.entity';

@Entity()
export class LikeDislike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: 'like' | 'dislike';

  // @ManyToOne(type => Seller, user => user.likesDislikes)
  // seller: Seller;

  // @ManyToOne(type => Review, review => review.likesDislikes)
  // review: Review;
}