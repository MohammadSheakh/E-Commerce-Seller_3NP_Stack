
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Seller } from '../../seller.entity';
import { Category } from '../category.entity';


@Entity()
export class ProductCategorySeller {
  @PrimaryGeneratedColumn()
  id: number;


  // eager true deowa thik hobe na may be .. eta niye pore kaj korte hobe 😢😢😢😢😢
  @ManyToOne(() => Seller, seller => seller.id, { onDelete: 'CASCADE' })
  //@JoinColumn() // age seller.categories chilo seller.id er jaygay 
  sellerId: number; // age Seller chilo

  @ManyToOne(() => Category, category => category.CategoryID, {eager:true, onDelete: 'CASCADE' })
  //@JoinColumn()//{ name: '' } //age category.sellers chilo category.CategoryID er jaygay
  categoryId: Category;
}