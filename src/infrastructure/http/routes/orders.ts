import {Router} from 'express';
import {OrderController} from '../controllers/OrderController';
import {CreateOrderCommandHandler} from '../../../application/order/command/CreateOrderCommand.handler';
import {Customer} from '../../../domain/customer/entity/Customer';
import {Product} from '../../../domain/product/entity/Product';
import {PriceCalculator} from '../../../domain/order/PriceCalculator';
import {getDataSource} from '../../../application/common/db/Database';

export const createOrdersRoutes = (router: Router) => {
    const productRepository = getDataSource().getRepository(Product);

    const orderController = new OrderController(
        productRepository,
        new CreateOrderCommandHandler(
            getDataSource().getRepository(Customer),
            productRepository,
            new PriceCalculator(),
        ),
    );

    router.post('/', (req, res) => orderController.create(req, res));

    return router;
}
