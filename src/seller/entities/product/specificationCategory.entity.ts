import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { type } from "os";
import { Specification } from "./specificaiton.entity";

@Entity()
export class SpecificationCategory{
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text', {default : ""})
    name: string;

    /*
    // now i title can have may be multiple description 🔴
    // how we can design that ? 
    // like screen can be of many size ..
    // tile should be screen 
    // description should be max size 
    // small size */

    // 🔗 Many Specification Category To One Product 
    @ManyToOne(() => Product, (product) => product.specificationCategory, {onDelete:'SET NULL'})
    /**
   * whats the type, what does it map to on the other table or the entity
   * // kono employee delete hoye gele .. task table er ei employee option e 
   * //null assign kore dibo .. jeno pore onno kono employee ke ei task assign kore deowa jete pare 
   */
    productId: Product;

    @OneToMany(() => Specification, (specificaiton)=>specificaiton.specificationCategoryId)
    specifications : Specification[]

}