import {DataSource} from 'typeorm';
import {Product} from '../src/domain/product/entity/Product';
import {Customer} from '../src/domain/customer/entity/Customer';
import {OrderItem} from '../src/domain/order/entity/OrderItem';
import {Order} from '../src/domain/order/entity/Order';
import {ProductCategory} from '../src/domain/category/entity/ProductCategory';

export const TestAppDataSource = new DataSource({
    name: 'TestAppDataSource',
    type: 'better-sqlite3',
    database: ':memory:',
    dropSchema: true,
    entities: [
        Customer,
        OrderItem,
        Order,
        Product,
        ProductCategory,
    ],
    synchronize: true,
    logging: false,
});
