import {Product} from './entity/Product';

// todo: may be enclosed in a class

export const MAX_STOCK_LEVEL = 10000;

export const assertPriceIsValid = (price: number): void => {
    if (price < 0) {
        throw new RangeError('Price must be a positive number');
    }
}

export const assertStockIsValid = (stock: number): void => {
    if (stock < 0) {
        throw new RangeError('Stock must be a positive number');
    }

    if (stock > MAX_STOCK_LEVEL) {
        throw new RangeError(`Stock must be less than ${MAX_STOCK_LEVEL}`);
    }
}

export const validateAllProductsInStock = (products: Product[]): void => {
    if (products.some(product => product.getStock() < 1)) {
        const outOfStockProducts = products.filter(product => product.getStock() < 1).map(p => p.name);

        throw new RangeError(`There are no products: ${JSON.stringify(outOfStockProducts)} in stock`);
    }
}

