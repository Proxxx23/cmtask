import {DataSource} from 'typeorm';
import {Customer} from '../../../domain/customer/entity/Customer';
import {OrderItem} from '../../../domain/order/entity/OrderItem';
import {Order} from '../../../domain/order/entity/Order';
import {ProductCategory} from '../../../domain/category/entity/ProductCategory';
import {Product} from '../../../domain/product/entity/Product';
import path from 'node:path';

export const AppDataSource = new DataSource({
    name: 'AppDataSource',
    type: 'better-sqlite3',
    database: path.resolve(process.cwd(), 'db/database'),
    entities: [
        Customer,
        OrderItem,
        Order,
        ProductCategory,
        Product
    ],
    synchronize: true,
    logging: false,
});
