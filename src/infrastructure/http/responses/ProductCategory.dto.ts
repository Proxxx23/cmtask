import {ProductCategory} from '../../../domain/category/entity/ProductCategory';

export class ProductCategoryDTO {
    private constructor(
        public readonly uuid: string,
        public readonly name: string,
    ) { }

    public static fromEntity(productCategory: ProductCategory): ProductCategoryDTO {
        return new ProductCategoryDTO(productCategory.uuid, productCategory.name);
    }
}
