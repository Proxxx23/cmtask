import {GetAllProductsQuery} from './GetAllProductsQuery';
import {ProductDTO} from '../../../infrastructure/http/responses/Product.dto';
import {QueryHandler} from '../../common/cqrs/QueryHandler';
import {Repository} from 'typeorm';
import {Product} from '../../../domain/product/entity/Product';

export class GetAllProductsQueryHandler implements QueryHandler<GetAllProductsQuery, ProductDTO[]> {
    constructor(private readonly repository: Repository<Product>) {}

    async handle(_query: GetAllProductsQuery): Promise<ProductDTO[]> {
        const results = await this.repository.find({
            relations: ['productCategory'],
        });

        return results.map((product) => ProductDTO.fromEntity(product));
    }
}
