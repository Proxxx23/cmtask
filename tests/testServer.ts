import 'reflect-metadata';
import express from 'express';
import {TestAppDataSource} from './TestAppDataSource';
import {createTestProductsRoutes} from './fixtures/routes/products';
import {createTestOrdersRoutes} from './fixtures/routes/orders';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

export const startTestServer = async () => {
    try {
        if (!TestAppDataSource.isInitialized) {
            console.log('Initializing TEST database connection...');
            await TestAppDataSource.initialize();
            console.log('TEST Database connection established.');
        }

        app.use('/products', createTestProductsRoutes(express.Router()));
        app.use('/orders', createTestOrdersRoutes(express.Router()));

        const server = app.listen(3001, () => {
            console.log(`Test API listening on port 3001...`);
        });

        console.log('Test server started.');

        return { app, server };
    } catch (error) {
        console.error('Error during database initialization:', error);
        process.exit(1);
    }
};
