"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestAppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Product_1 = require("../src/domain/product/entity/Product");
const Customer_1 = require("../src/domain/customer/entity/Customer");
const OrderItem_1 = require("../src/domain/order/entity/OrderItem");
const Order_1 = require("../src/domain/order/entity/Order");
const ProductCategory_1 = require("../src/domain/category/entity/ProductCategory");
exports.TestAppDataSource = new typeorm_1.DataSource({
    name: 'TestAppDataSource',
    type: 'better-sqlite3',
    database: ':memory:',
    dropSchema: true,
    entities: [
        Customer_1.Customer,
        OrderItem_1.OrderItem,
        Order_1.Order,
        Product_1.Product,
        ProductCategory_1.ProductCategory,
    ],
    synchronize: true,
    logging: false,
});
