import {CreateOrderRequest} from '../../../infrastructure/http/requests/types/orders';
import {Product} from '../../../domain/product/entity/Product';
import {Customer} from '../../../domain/customer/entity/Customer';

export type ProductIdWithQuantity = {
    id: Product['uuid'];
    quantity: number;
}

export class CreateOrderCommand {
    private constructor(
        public readonly customerId: Customer['uuid'],
        public readonly products: ProductIdWithQuantity[],
    ) {}

    public static fromRequest(data: CreateOrderRequest): CreateOrderCommand {
        return new CreateOrderCommand(data.customerId, data.products);
    }
}
