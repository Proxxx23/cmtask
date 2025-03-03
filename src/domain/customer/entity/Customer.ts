import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Order} from '../../order/entity/Order';

export type Location = 'Europe' | 'Asia' | 'USA' | 'Africa' | 'Oceania';

@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ type: 'text'})
    public uuid: string;

    @Column({ name: 'first_name' })
    public firstName: string;

    @Column( { name: 'last_name' })
    public lastName: string;

    @Column()
    public email: string;

    @Column()
    public location: Location;

    @Column({ type: 'datetime', name: 'created_at' })
    public createdAt: Date;

    @Column({ type: 'datetime', name: 'updated_at' })
    public updatedAt: Date;

    @Column({ type: 'datetime', nullable: true, name: 'deleted_at' })
    public deletedAt: Date;

    @OneToMany(() => Customer, customer => customer.orders)
    public orders: Order[];
}
