import {Router} from 'express';
import {Product} from '../../../src/domain/product/entity/Product';
import {ProductCategory} from '../../../src/domain/category/entity/ProductCategory';
import {TestAppDataSource} from '../../TestAppDataSource';
import {ProductController} from '../../../src/infrastructure/http/controllers/ProductController';
import {GetAllProductsQueryHandler} from '../../../src/application/product/query/GetAllProductsQuery.handler';
import {
    ChangeProductStockLevelCommandHandler
} from '../../../src/application/product/command/ChangeProductStockLevelCommand.handler';
import {CreateProductCommandHandler} from '../../../src/application/product/command/CreateProductCommand.handler';
import {SellProductCommandHandler} from '../../../src/application/product/command/SellProductCommand.handler';


export const createTestProductsRoutes = (router: Router) => {
    const productRepository = TestAppDataSource.getRepository(Product);
    const productCategoryRepository = TestAppDataSource.getRepository(ProductCategory);

    const productController = new ProductController(
        new GetAllProductsQueryHandler(productRepository),
        new CreateProductCommandHandler(productRepository, productCategoryRepository),
        new ChangeProductStockLevelCommandHandler(productRepository),
        new SellProductCommandHandler(productRepository),
    );

    router.get('/', (req, res) => productController.getAll(req, res));
    router.post('/', (req, res) => productController.create(req, res));
    router.post('/:id/restock', (req, res) => productController.changeStockLevel(req, res));
    router.post('/:id/sell', (req, res) => productController.sellProduct(req, res));

    return router;
}
