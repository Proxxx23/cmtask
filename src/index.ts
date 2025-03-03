import 'reflect-metadata';
import express from 'express';
import {createProductsRoutes} from './infrastructure/http/routes/products';
import helmet from 'helmet';
import {createOrdersRoutes} from './infrastructure/http/routes/orders';
import {AppDataSource} from './application/common/db/DataSource';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

const startServer = async () => {
    try {
        if (!AppDataSource.isInitialized) {
            console.log('Initializing database connection...');
            await AppDataSource.initialize();
            console.log('Database connection established.');
        }

        app.use('/products', createProductsRoutes(express.Router()));
        app.use('/orders', createOrdersRoutes(express.Router()));

        app.listen(3000, () => {
            console.log(`API listening on port 3000...`);
        });
    } catch (error) {
        console.error('Error during database initialization:', error);
        process.exit(1);
    }
};

startServer();
