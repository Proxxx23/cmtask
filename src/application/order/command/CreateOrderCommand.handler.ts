import {CreateOrderCommand, ProductIdWithQuantity} from './CreateOrderCommand';
import {Order} from '../../../domain/order/entity/Order';
import {OrderDTO} from '../../../infrastructure/http/responses/Order.dto';
import {CommandHandler} from '../../common/cqrs/CommandHandler';
import {Product} from '../../../domain/product/entity/Product';
import {validateAllProductsInStock} from '../../../domain/product/validators';
import {In, Repository} from 'typeorm';
import {Customer} from '../../../domain/customer/entity/Customer';
import {OrderItem} from '../../../domain/order/entity/OrderItem';
import {BadRequest} from 'http-errors';
import {PriceCalculator} from '../../../domain/order/PriceCalculator';
import {getDataSource} from '../../common/db/Database';

export type ProductWithQuantity = {
    product: Product;
    quantity: number;
}

export class CreateOrderCommandHandler implements CommandHandler<CreateOrderCommand, OrderDTO> {
    constructor(
        private readonly customerRepository: Repository<Customer>,
        private readonly productsRepository: Repository<Product>,
        private readonly priceCalculator: PriceCalculator,
    ) {
    }

    async handle(command: CreateOrderCommand): Promise<OrderDTO> {
        const customer = await this.customerRepository.findOneBy({uuid: command.customerId});
        if (!customer) {
            throw new BadRequest('Customer not found');
        }

        const productIds = command.products.map(product => product.id);
        const products = await this.productsRepository.find(
            {
                where: { uuid: In(productIds) },
                relations: ['productCategory'],
            }
        );

        if (productIds.length !== products.length) {
            throw new BadRequest('At least one product was not found');
        }

        const productsWithQuantities = this.mapToProductsWithQuantities(command.products, products);
        const orderItems = this.createOrderItems(productsWithQuantities, customer);
        const order = Order.create(customer, orderItems);

        const queryRunner = getDataSource().createQueryRunner();

        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.save(order);
            for (const product of products) {
                product.decreaseStockByOne();
                await queryRunner.manager.save<Product>(product);
            }
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();

            throw error;
        } finally {
            await queryRunner.release();
        }

        return OrderDTO.fromEntity(order);
    }

    private mapToProductsWithQuantities(
        commandProducts: ProductIdWithQuantity[],
        products: Product[]
    ): ProductWithQuantity[] {
        validateAllProductsInStock(products);

        const productsWithQuantities = commandProducts.reduce((acc, commandProduct) => {
            const product = products.find(product => product.uuid === commandProduct.id) as Product;

            if (product) {
                acc.push({
                    product,
                    quantity: commandProduct.quantity
                });
            }

            return acc;
        }, [] as ProductWithQuantity[]);

        this.checkEnoughInStock(products, productsWithQuantities);

        return productsWithQuantities;
    }

    /**
     * Checks if there is enough stock for each product
     */
    private checkEnoughInStock(
        products: Product[],
        productsWithQuantities: ProductWithQuantity[]
    ): void {
        productsWithQuantities.forEach(productWithQuantity => {
            const product = products.find(p => p.uuid === productWithQuantity.product.uuid) as Product;

            if (product.getStock() < productWithQuantity.quantity) {
                throw new BadRequest(`Not enough product "${product.name}" in stock.`);
            }
        });
    }

    private createOrderItems(
        productsWithQuantities: ProductWithQuantity[],
        customer: Customer
    ): OrderItem[] {
        return productsWithQuantities.map(product => {
            const price = this.priceCalculator.calculatePrice(customer, product.product, product.quantity); // todo: static/DI?

            return OrderItem.create(
                product.product,
                price,
                product.quantity
            )
        });
    }
}
