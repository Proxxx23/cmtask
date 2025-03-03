import {CreateProductCommand} from './CreateProductCommand';
import {Product} from '../../../domain/product/entity/Product';
import {ProductDTO} from '../../../infrastructure/http/responses/Product.dto';
import {CommandHandler} from '../../common/cqrs/CommandHandler';
import {Repository} from 'typeorm';
import {ProductCategory} from '../../../domain/category/entity/ProductCategory';
import {BadRequest} from 'http-errors';

export class CreateProductCommandHandler implements CommandHandler<CreateProductCommand, ProductDTO> {
    constructor(
        private readonly productRepository: Repository<Product>,
        private readonly productCategoryRepository: Repository<ProductCategory>
    ) {}

    async handle(command: CreateProductCommand): Promise<ProductDTO> {
        const productCategory = await this.productCategoryRepository.findOneBy({ uuid: command.productCategoryId });
        if (!productCategory) {
            throw new BadRequest('Product category not found.');
        }

        const productAlreadyExists = await this.productRepository.findOneBy({ name: command.name });
        if (productAlreadyExists) {
            throw new BadRequest('Product already exists.');
        }

        const productEntity = Product.fromCommand(command, productCategory);

        await this.productRepository.save(productEntity);

        return ProductDTO.fromEntity(productEntity);
    }
}
