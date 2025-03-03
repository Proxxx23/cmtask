import {ProductDTO} from '../../../infrastructure/http/responses/Product.dto';
import {CommandHandler} from '../../common/cqrs/CommandHandler';
import {SellProductCommand} from './SellProductCommand';
import {Repository} from 'typeorm';
import {Product} from '../../../domain/product/entity/Product';
import {NotFound} from 'http-errors';

export class SellProductCommandHandler implements CommandHandler<SellProductCommand, ProductDTO | undefined> {
    constructor(private readonly productRepository: Repository<Product>) {}

    async handle({ productId }: SellProductCommand): Promise<ProductDTO | undefined> {
        const product = await this.productRepository.findOne(
            {
                where: { uuid: productId } ,
                relations: ['productCategory'],
            },
        );

        if (!product) {
            throw new NotFound('Product not found.');
        }

        product.decreaseStockByOne();

        await this.productRepository.save(product)

        return ProductDTO.fromEntity(product);
    }
}
