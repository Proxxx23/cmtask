import {Router} from 'express';
import {TestAppDataSource} from '../../TestAppDataSource';
import {Product} from '../../../src/domain/product/entity/Product';
import {OrderController} from '../../../src/infrastructure/http/controllers/OrderController';
import {CreateOrderCommandHandler} from '../../../src/application/order/command/CreateOrderCommand.handler';
import {Customer} from '../../../src/domain/customer/entity/Customer';
import {PriceCalculator} from '../../../src/domain/order/PriceCalculator';

export const createTestOrdersRoutes = (router: Router) => {
    const productRepository = TestAppDataSource.getRepository(Product);

    const orderController = new OrderController(
        productRepository,
        new CreateOrderCommandHandler(
            TestAppDataSource.getRepository(Customer),
            productRepository,
            new PriceCalculator(),
        ),
    );

    router.post('/', (req, res) => orderController.create(req, res));

    return router;
}
