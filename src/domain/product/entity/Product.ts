import {randomUUID} from 'node:crypto';
import {assertPriceIsValid, assertStockIsValid} from '../validators';
import {ProductCategory} from '../../category/entity/ProductCategory';
import {CreateProductCommand} from '../../../application/product/command/CreateProductCommand';
import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import {OrderItem} from '../../order/entity/OrderItem';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    public readonly id: number;

    @Column({ type: 'text'})
    public uuid: string;

    @Column()
    public name: string;

    @Column()
    public description: string;

    @Column()
    // @ts-ignore
    private price: number;

    @Column()
    private stock: number;

    @Column({ type: 'datetime', name: 'created_at' })
    public createdAt: Date;

    @Column({ type: 'datetime', name: 'updated_at' })
    public updatedAt: Date;

    @Column({ type: 'datetime', nullable: true, name: 'deleted_at' })
    public deletedAt: Date;

    @OneToOne(() => OrderItem, orderItem => orderItem.product)
    public orderItems: OrderItem[];

    @ManyToOne(() => ProductCategory, productCategory => productCategory.products)
    @JoinColumn({ name: 'productCategoryId' })
    public productCategory: ProductCategory;

    public getStock(): number {
        return this.stock;
    }

    public decreaseStockByOne(): void {
        this.setStock(this.stock - 1);
    }

    // fixme: as stock is not private, it can be set to any value...
    // fixme: backing method + getter/setter?
    public setStock(stock: number): void {
        assertStockIsValid(stock);

        this.stock = stock;
    }

    public getPrice(): number {
        return this.price;
    }

    // fixme: as price is not private, it can be set to any value
    public setPrice(price: number): void {
        assertPriceIsValid(price);

        this.price = price;
    }

    public static fromCommand(
        data: CreateProductCommand,
        productCategory: ProductCategory
    ): Product {
        const product = new Product();
        product.uuid = randomUUID();
        product.name = data.name;
        product.description = data.description;
        product.setPrice(data.price);
        product.setStock(data.stock);
        product.productCategory = productCategory;
        product.createdAt = new Date();
        product.updatedAt = new Date();

        return product;
    }
}
