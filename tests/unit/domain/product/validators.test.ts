import {
    assertPriceIsValid,
    assertStockIsValid,
    MAX_STOCK_LEVEL,
    validateAllProductsInStock
} from '../../../../src/domain/product/validators';
import {createProduct} from '../../../fixtures/Product';

describe('Product Validators', () => {
    describe('assertPriceIsValid', () => {
        it('should throw if price is negative', () => {
            expect(() => assertPriceIsValid(-1)).toThrow(new RangeError('Price must be a positive number'));
        });

        it('should not throw an error if the price is between 0 and 10000', () => {
            expect(() => assertPriceIsValid(5000)).not.toThrow();
        });
    });

    describe('assertStockIsValid', () => {
        it('should throw if stock is negative', () => {
            expect(() => assertStockIsValid(-1)).toThrow(new RangeError('Stock must be a positive number'));
        });

        it(`should throw an error if stock is greater than ${MAX_STOCK_LEVEL}`, () => {
            expect(() => assertStockIsValid(MAX_STOCK_LEVEL + 1)).toThrow(
                new RangeError(`Stock must be less than ${MAX_STOCK_LEVEL}`)
            );
        });

        it(`should not throw an error if stock is between 0 and ${MAX_STOCK_LEVEL}`, () => {
            expect(() => assertStockIsValid(5000)).not.toThrow();
        });
    });

    describe('validateAllProductsInStock', () => {
        it('should throw if any product is out of stock', () => {
            const product1 = createProduct('Product 1', 'Product 1 description', 100, 0);
            const product2 = createProduct('Product 2', 'Product 2 description', 200, 5);
            const products = [product1, product2];

            expect(() => validateAllProductsInStock(products)).toThrow(
                new RangeError('There are no products: ["Product 1"] in stock')
            );
        });

        it('should not throw if all products are in stock', () => {
            const product1 = createProduct('Product 1', 'Product 1 description', 100, 10);
            const product2 = createProduct('Product 2', 'Product 2 description', 200, 5);
            const products = [product1, product2];

            expect(() => validateAllProductsInStock(products)).not.toThrow();
        });

        it('should throw and list all out-of-stock products', () => {
            const product1 = createProduct('Product 1', 'Product 1 description', 100, 0);
            const product2 = createProduct('Product 2', 'Product 2 description', 200, 0);
            const products = [product1, product2];

            expect(() => validateAllProductsInStock(products)).toThrow(
                new RangeError('There are no products: ["Product 1","Product 2"] in stock')
            );
        });
    });
});
