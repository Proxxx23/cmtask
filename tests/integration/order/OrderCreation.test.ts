import 'reflect-metadata';
import supertest from 'supertest';
import {Express} from 'express';
import {StatusCodes} from 'http-status-codes';
import * as http from 'node:http';
import {TestAppDataSource} from '../../TestAppDataSource';
import {startTestServer} from '../../testServer';
import {createMockData} from '../../fixtures/DatabaseMockData';
import {randomUUID} from 'node:crypto';

describe('Order Creation', () => {
    let server: http.Server;
    let app: Express;
    let productId: string;
    let customerId: string;

    beforeAll(async () => {
        const srv = await startTestServer();
        server = srv.server;
        app = srv.app;

        const {
            product,
            customer,
        } = await createMockData();

        productId = product.uuid;
        customerId = customer.uuid;
    });

    afterAll(async () => {
        await TestAppDataSource.destroy();
        server.close();
    });

    it('should create an order', async () => {
        const response = await supertest(app).post('/orders').send({
            customerId,
            products: [
                {
                    id: productId,
                    quantity: 2
                },
            ],
        });

        expect(response.status).toBe(StatusCodes.CREATED);
    });

    it('should return 404 if customer does not exist', async () => {
        const response = await supertest(app).post('/orders').send({
            customerId: randomUUID(),
            products: [
                {
                    id: productId,
                    quantity: 2
                },
            ],
        });

        const responseMessage = JSON.parse(response.text);

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(responseMessage.message).toBe('Customer not found');
    });

    it('should return 404 if one of the products does not exist', async () => {
        const response = await supertest(app).post('/orders').send({
            customerId: randomUUID(),
            products: [
                {
                    id: productId,
                    quantity: 2
                },
                {
                    id: randomUUID(),
                    quantity: 100,
                }
            ],
        });

        const responseMessage = JSON.parse(response.text);

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
        expect(responseMessage.message).toBe('Some products does not exist');
    });
})
