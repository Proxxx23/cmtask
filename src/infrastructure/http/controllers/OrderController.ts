import { Request, Response } from 'express';
import {ApiResponse, respondBadRequest, respondInternalError} from '../../../application/common/api/response';
import {OrderDTO} from '../responses/Order.dto';
import {createOrderSchema} from '../requests/schema/orders-schema';
import {CreateOrderCommand} from '../../../application/order/command/CreateOrderCommand';
import {CreateOrderCommandHandler} from '../../../application/order/command/CreateOrderCommand.handler';
import {CreateOrderRequest} from '../requests/types/orders';
import {In, Repository} from 'typeorm';
import {Product} from '../../../domain/product/entity/Product';
import {BadRequest} from 'http-errors';
import {StatusCodes} from 'http-status-codes';

export class OrderController {
    constructor(
        private readonly productRepository: Repository<Product>,
        private readonly createOrderHandler: CreateOrderCommandHandler
    ) {}

    public async create(req: Request<{}, {}, CreateOrderRequest>, res: Response): ApiResponse<OrderDTO> {
        const payload = req.body;

        const validation = createOrderSchema.validate(payload);
        if (validation.error) {
            return respondBadRequest(res, validation.error.message);
        }

        if (!await this.allProductsExist(payload.products.map(p => p.id))) {
            return respondBadRequest(res, 'Some products does not exist');
        }

        try {
            const command = CreateOrderCommand.fromRequest(payload);
            const orderDTO = await this.createOrderHandler.handle(command);

            return res.status(StatusCodes.CREATED).send(orderDTO);
        } catch (error) {
            if (error instanceof RangeError || error instanceof BadRequest) {
                return respondBadRequest(res, error.message);
            }

            return respondInternalError(res);
        }
    }

    private async allProductsExist(productIds: Product['uuid'][]): Promise<boolean> {
        const products = await this.productRepository.findBy({ uuid: In(productIds) });

        return products.length === productIds.length;
    }
}
