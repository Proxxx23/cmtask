import {ProductDTO} from '../../../infrastructure/http/responses/Product.dto';
import {CommandHandler} from '../../common/cqrs/CommandHandler';
import {ChangeProductStockLevelCommand} from './ChangeProductStockLevelCommand';
import {Repository} from 'typeorm';
import {Product} from '../../../domain/product/entity/Product';
import {BadRequest} from 'http-errors';

export class ChangeProductStockLevelCommandHandler implements CommandHandler<ChangeProductStockLevelCommand, ProductDTO> {
    constructor(private readonly productRepository: Repository<Product>) {}

    async handle({ stock, productId }: ChangeProductStockLevelCommand): Promise<ProductDTO> {
        const product = await this.productRepository.findOne(
            {
                where: {
                    uuid: productId
                },
                relations: ['productCategory']
            }
        );

        if (!product) {
            throw new BadRequest('Product not found.');
        }

        product.setStock(stock);

        await this.productRepository.save(product)

        return ProductDTO.fromEntity(product);
    }
}
