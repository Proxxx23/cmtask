import {TestAppDataSource} from '../TestAppDataSource';
import {ProductCategory} from '../../src/domain/category/entity/ProductCategory';
import {randomUUID} from 'node:crypto';
import {Product} from '../../src/domain/product/entity/Product';
import {Customer} from '../../src/domain/customer/entity/Customer';

type MockData = {
    product: Product;
    productCategory: ProductCategory;
    customer: Customer;
}

export const createMockData = async (stock: number = 100): Promise<MockData> => {
    const productCategoryRepository = TestAppDataSource.getRepository(ProductCategory);
    const productCategory = productCategoryRepository.create({
        uuid: randomUUID(),
        name: 'Test Category',
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    await productCategoryRepository.save(productCategory);

    const productRepository = TestAppDataSource.getRepository(Product);
    const productUuid = randomUUID();
    const product = productRepository.create({
        uuid: productUuid,
        name: 'Test Product',
        description: 'Test Description',
        price: 10.0,
        stock,
        productCategory,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    await productRepository.save(product);

    const customerRepository = TestAppDataSource.getRepository(Customer);
    const customerUuid = randomUUID();
    const customer = customerRepository.create({
        uuid: customerUuid,
        firstName: 'Test Product',
        lastName: 'Test Description',
        email: 'foobar@baz.com',
        location: 'Europe',
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    await customerRepository.save(customer);

    return {
        product,
        productCategory,
        customer,
    }
}
