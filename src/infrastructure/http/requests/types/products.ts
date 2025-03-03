import {ProductCategory} from '../../../../domain/category/entity/ProductCategory';

export type CreateProductRequest = {
    name: string;
    description: string;
    price: number;
    stock: number;
    productCategoryId: ProductCategory['uuid'];
};

export type ProductIdQueryParams = {
    id: string;
};

export type ChangeStockLevelRequest = {
    stock: number;
}
