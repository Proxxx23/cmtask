import {randomUUID} from 'node:crypto';
import {Customer} from '../../customer/entity/Customer';
import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {OrderItem} from './OrderItem';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ type: 'text'})
    public uuid: string;

    @ManyToOne(() => Customer, customer => customer.orders)
    @JoinColumn({ name: 'customer_id' })
    public customer: Customer;

    @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
    public orderItems: OrderItem[];

    @Column({ type: 'datetime', name: 'created_at' })
    public createdAt: Date;

    @Column({ type: 'datetime', name: 'updated_at' })
    public updatedAt: Date;

    @Column({ type: 'datetime', nullable: true, name: 'deleted_at' })
    public deletedAt: Date;

    public static create(customer: Customer, orderItems: OrderItem[]): Order {
        const order =  new Order()

        order.uuid = randomUUID();
        order.customer = customer;
        order.orderItems = orderItems;
        order.createdAt = new Date();
        order.updatedAt = new Date();

        return order;
    }
}
