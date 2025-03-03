import {Router} from 'express';
import {ProductController} from '../controllers/ProductController';
import {GetAllProductsQueryHandler} from '../../../application/product/query/GetAllProductsQuery.handler';
import {CreateProductCommandHandler} from '../../../application/product/command/CreateProductCommand.handler';
import {
    ChangeProductStockLevelCommandHandler
} from '../../../application/product/command/ChangeProductStockLevelCommand.handler';
import {SellProductCommandHandler} from '../../../application/product/command/SellProductCommand.handler';
import {AppDataSource} from '../../../application/common/db/DataSource';
import {Product} from '../../../domain/product/entity/Product';
import {ProductCategory} from '../../../domain/category/entity/ProductCategory';

export const createProductsRoutes = (router: Router) => {
    const productRepository = AppDataSource.getRepository(Product);
    const productCategoryRepository = AppDataSource.getRepository(ProductCategory);

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
