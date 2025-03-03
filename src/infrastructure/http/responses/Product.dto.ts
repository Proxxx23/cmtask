import {Product} from '../../../domain/product/entity/Product';
import {ProductCategoryDTO} from './ProductCategory.dto';

export class ProductDTO {
    constructor(
        public readonly uuid: string,
        public readonly name: string,
        public readonly description: string,
        public readonly price: number,
        public readonly stock: number,
        public readonly productCategory: ProductCategoryDTO,
    ) {}

    public static fromEntity(product: Product): ProductDTO {
        return new ProductDTO(
            product.uuid,
            product.name,
            product.description,
            product.getPrice(),
            product.getStock(),
            ProductCategoryDTO.fromEntity(product.productCategory)
        );
    }
}
