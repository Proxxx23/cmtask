import {Request, Response} from 'express';
import {ProductDTO} from '../responses/Product.dto';
import {GetAllProductsQueryHandler} from '../../../application/product/query/GetAllProductsQuery.handler';
import {createProductSchema, changeProductStockLevelSchema} from '../requests/schema/products-schema';
import {CreateProductCommandHandler} from '../../../application/product/command/CreateProductCommand.handler';
import {CreateProductCommand} from '../../../application/product/command/CreateProductCommand';
import {GetAllProductsQuery} from '../../../application/product/query/GetAllProductsQuery';
import {
    ApiResponse,
    respondBadRequest,
    respondInternalError,
    respondNotFound
} from '../../../application/common/api/response';
import {CreateProductRequest, ProductIdQueryParams, ChangeStockLevelRequest} from '../requests/types/products';
import {ChangeProductStockLevelCommand} from '../../../application/product/command/ChangeProductStockLevelCommand';
import {
    ChangeProductStockLevelCommandHandler
} from '../../../application/product/command/ChangeProductStockLevelCommand.handler';
import {SellProductCommand} from '../../../application/product/command/SellProductCommand';
import {SellProductCommandHandler} from '../../../application/product/command/SellProductCommand.handler';
import {BadRequest, NotFound} from 'http-errors';
import {StatusCodes} from 'http-status-codes';

export class ProductController {
    constructor(
        private readonly getAllProductsQueryHandler: GetAllProductsQueryHandler,
        private readonly createProductCommandHandler: CreateProductCommandHandler,
        private readonly changeProductStockLevelCommandHandler: ChangeProductStockLevelCommandHandler,
        private readonly sellProductCommandHandler: SellProductCommandHandler,
    ) {}

    public async getAll(_req: Request, res: Response): ApiResponse<ProductDTO> {
        const productDTOs = await this.getAllProductsQueryHandler.handle(new GetAllProductsQuery());

        return res.send(productDTOs);
    }

    public async create(
        req: Request<unknown, unknown, CreateProductRequest>,
        res: Response
    ): ApiResponse<ProductDTO> {
        const payload = req.body;

        const validation = createProductSchema.validate(payload);
        if (validation.error) {
            return respondBadRequest(res, validation.error.message);
        }

        try {
            const command = CreateProductCommand.fromRequest(payload);
            const productDTO = await this.createProductCommandHandler.handle(command);

            return res.status(StatusCodes.CREATED).send(productDTO);
        } catch (error) {
            if (error instanceof RangeError || error instanceof BadRequest) {
                return respondBadRequest(res, error.message);
            }

            return respondInternalError(res);
        }
    }

    public async changeStockLevel(
        req: Request<ProductIdQueryParams, unknown, ChangeStockLevelRequest>,
        res: Response
    ): ApiResponse<ProductDTO> {
        const payload = req.body;

        const validation = changeProductStockLevelSchema.validate(payload);
        if (validation.error) {
            return respondBadRequest(res, validation.error.message);
        }

        try {
            const command = ChangeProductStockLevelCommand.fromRequest(req.params.id, payload.stock);
            const productDTO = await this.changeProductStockLevelCommandHandler.handle(command);

            return res.send(productDTO);
        } catch (error) {
            if (error instanceof RangeError || error instanceof BadRequest) {
                return respondBadRequest(res, error.message);
            }

            return respondInternalError(res);
        }
    }

    public async sellProduct(
        req: Request<ProductIdQueryParams, unknown, unknown>,
        res: Response
    ): ApiResponse<ProductDTO> {
        try {
            const command = new SellProductCommand(req.params.id);
            const productDTO = await this.sellProductCommandHandler.handle(command);

            return res.send(productDTO);
        } catch (error) {
            if (error instanceof RangeError) {
                return respondBadRequest(res, 'Product out of stock.');
            }

            if (error instanceof NotFound) {
                return respondNotFound(res, error.message);
            }

            return respondInternalError(res);
        }
    }
}
