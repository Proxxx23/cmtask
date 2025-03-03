import {randomUUID} from 'node:crypto';
import {CreateProductRequest} from '../../../infrastructure/http/requests/types/products';
import {ProductCategory} from '../../../domain/category/entity/ProductCategory';

export class CreateProductCommand {
    private constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly description: string,
        public readonly price: number,
        public readonly stock: number,
        public readonly productCategoryId: ProductCategory['uuid']
    ) {}

    public static fromRequest(data: CreateProductRequest): CreateProductCommand {
        return new CreateProductCommand(
            randomUUID(),
            data.name,
            data.description,
            data.price,
            data.stock,
            data.productCategoryId
        );
    }
}
