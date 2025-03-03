import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Order} from './Order';
import {Product} from '../../product/entity/Product';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn()
    public id: number;

    @ManyToOne(() => Order, order => order.orderItems)
    @JoinColumn({ name: 'order_id' })
    public order: Order;

    @ManyToOne(() => Product, product => product.orderItems)
    @JoinColumn({ name: 'product_id' })
    public product: Product;

    @Column({ type: 'int' })
    public quantity: number;

    @Column({ type: 'int' })
    public price: number;

    @Column({ type: 'datetime', name: 'created_at' })
    public createdAt: Date;

    @Column({ type: 'datetime', name: 'updated_at' })
    public updatedAt: Date;

    @Column({ type: 'datetime', nullable: true, name: 'deleted_at' })
    public deletedAt: Date;

    public static create(
        product: Product,
        price: number,
        quantity: number
    ): OrderItem {
        const orderItem = new OrderItem();
        orderItem.product = product;
        orderItem.price = price
        orderItem.quantity = quantity;
        orderItem.createdAt = new Date();
        orderItem.updatedAt = new Date();

        return orderItem;
    }
}
