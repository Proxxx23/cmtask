import 'reflect-metadata';
import supertest from 'supertest';
import {Express} from 'express';
import {StatusCodes} from 'http-status-codes';
import * as http from 'node:http';
import {TestAppDataSource} from '../../TestAppDataSource';
import {startTestServer} from '../../testServer';
import {createMockData} from '../../fixtures/DatabaseMockData';
import {Product} from '../../../src/domain/product/entity/Product';
import {ProductCategory} from '../../../src/domain/category/entity/ProductCategory';
import {randomUUID} from 'node:crypto';
import {MAX_STOCK_LEVEL} from '../../../src/domain/product/validators';

describe('Product endpoints', () => {
    let server: http.Server;
    let app: Express;
    let product: Product;
    let productCategory: ProductCategory;

    beforeAll(async () => {
        const srv = await startTestServer();
        server = srv.server;
        app = srv.app;

        const mockData = await createMockData();
        product = mockData.product;
        productCategory = mockData.productCategory;
    });

    afterAll(async () => {
        await TestAppDataSource.destroy();
        server.close();
    });

    describe('GET /products', () => {
        it('should get all products', async () => {
            const response = await supertest(app).get('/products');

            const responsePayload = JSON.parse(response.text);

            expect(response.status).toBe(StatusCodes.OK);
            expect(responsePayload).toHaveLength(1);
            expect(responsePayload[0]['uuid']).toBe(product.uuid);
            expect(responsePayload[0]['name']).toBe(product.name);
        });
    });

    describe('POST /products', () => {
        it('should create a new product', async () => {
            const response = await supertest(app)
                .post('/products')
                .send({
                    name: 'New Product',
                    description: 'New Description',
                    price: 10,
                    stock: 100,
                    productCategoryId: productCategory.uuid,
                });

            expect(response.status).toBe(StatusCodes.CREATED);
        });

        it('should respond with 400 if non-existent category specified', async () => {
            const response = await supertest(app)
                .post('/products')
                .send({
                    name: 'New Product',
                    description: 'New Description',
                    price: 10,
                    stock: 100,
                    productCategoryId: randomUUID(),
                });

            const responsePayload = JSON.parse(response.text);

            expect(response.status).toBe(StatusCodes.BAD_REQUEST);
            expect(responsePayload.message).toBe('Product category not found.');
        });

        it('should respond with 400 if product with given name already exists', async () => {
            const response = await supertest(app)
                .post('/products')
                .send({
                    name: product.name,
                    description: 'New Description',
                    price: 10,
                    stock: 100,
                    productCategoryId: productCategory.uuid,
                });

            const responsePayload = JSON.parse(response.text);

            expect(response.status).toBe(StatusCodes.BAD_REQUEST);
            expect(responsePayload.message).toBe('Product already exists.');
        });

        describe('POST /:id/restock (change stock level)', () => {
            it('should change stock level', async () => {
                const response = await supertest(app)
                    .post(`/products/${product.uuid}/restock`)
                    .send({
                        stock: MAX_STOCK_LEVEL - 10,
                    });

                expect(response.status).toBe(StatusCodes.OK);
            });

            it('should return 400 on trying to increase stock level above max stock level', async () => {
                const response = await supertest(app)
                    .post(`/products/${product.uuid}/restock`)
                    .send({
                        stock: MAX_STOCK_LEVEL + 10,
                    });

                expect(response.status).toBe(StatusCodes.BAD_REQUEST);
            });

            it('should return 400 on trying to set negative stock level', async () => {
                const response = await supertest(app)
                    .post(`/products/${product.uuid}/restock`)
                    .send({
                        stock: -100,
                    });

                expect(response.status).toBe(StatusCodes.BAD_REQUEST);
            });
        });

        describe('POST /:id/sell', () => {
            it('should allow to sell a product', async () => {
                const response = await supertest(app)
                    .post(`/products/${product.uuid}/sell`)
                    .send();

                expect(response.status).toBe(StatusCodes.OK);
            });

            it('should disallow selling out-of-stock product', async () => {
                const { product } = await createMockData(0);

                const response = await supertest(app)
                    .post(`/products/${product.uuid}/sell`)
                    .send();

                const responsePayload = JSON.parse(response.text);

                expect(response.status).toBe(StatusCodes.BAD_REQUEST);
                expect(responsePayload.message).toBe('Product out of stock.');
            });
        });
    });
})
