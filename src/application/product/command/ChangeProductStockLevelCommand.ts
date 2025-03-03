import {Product} from '../../../domain/product/entity/Product';

export class ChangeProductStockLevelCommand {
    private constructor(
        public readonly productId: Product['uuid'],
        public readonly stock: number,
    ) {}

    public static fromRequest(
        productId: Product['uuid'],
        stock: number,
    ): ChangeProductStockLevelCommand {
        return new ChangeProductStockLevelCommand(
            productId,
            stock,
        );
    }
}
