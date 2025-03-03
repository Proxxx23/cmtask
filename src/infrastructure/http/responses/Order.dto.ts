import {Order} from '../../../domain/order/entity/Order';
import {CustomerDTO} from './Customer.dto';
import {ProductDTO} from './Product.dto';

export class OrderDTO {
    constructor(
        public readonly orderId: Order['uuid'],
        public readonly customer: CustomerDTO,
        public readonly products: ProductDTO[],
    ) {}

    public static fromEntity(order: Order): OrderDTO {
        return new OrderDTO(
            order.uuid,
            CustomerDTO.fromEntity(order.customer),
            order.orderItems.map(orderItem => ProductDTO.fromEntity(orderItem.product)),
        );
    }
}
