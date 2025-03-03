import {Product} from '../../src/domain/product/entity/Product';
import {ProductCategory} from '../../src/domain/category/entity/ProductCategory';
import {randomUUID} from 'node:crypto';

export const createProduct = (
    name = 'Product 1',
    description = 'Product 1 description',
    price = 100,
    stock = 10,
    productCategoryName = 'electronics',
): Product => {
    const productCategory = new ProductCategory();
    productCategory.name = productCategoryName;
    productCategory.createdAt = new Date();
    productCategory.updatedAt = new Date();

    const product = new Product();
    product.uuid = randomUUID();
    product.name = name;
    product.description = description;
    product.setPrice(price);
    product.setStock(stock);
    product.productCategory = productCategory;
    product.createdAt = new Date();
    product.updatedAt = new Date();

    return product;
}
