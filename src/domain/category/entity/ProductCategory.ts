import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Product} from '../../product/entity/Product';

@Entity('product_categories')
export class ProductCategory {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ type: 'text' })
    public uuid: string;

    @Column()
    public name: string;

    @Column({ type: 'datetime', name: 'created_at' })
    public createdAt: Date;

    @Column({ type: 'datetime', name: 'updated_at' })
    public updatedAt: Date;

    @Column({ type: 'datetime', nullable: true, name: 'deleted_at' })
    public deletedAt: Date;

    @OneToMany(() => Product, product => product.productCategory)
    public products: Product[];
}
