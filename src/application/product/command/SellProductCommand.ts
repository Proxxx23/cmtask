import {Product} from '../../../domain/product/entity/Product';

export class SellProductCommand {
    constructor(public readonly productId: Product['uuid']) {}
}
