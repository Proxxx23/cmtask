import {Customer} from '../../../../domain/customer/entity/Customer';
import {ProductIdWithQuantity} from '../../../../application/order/command/CreateOrderCommand';

export type CreateOrderRequest = {
    customerId: Customer['uuid'];
    products: ProductIdWithQuantity[];
};
