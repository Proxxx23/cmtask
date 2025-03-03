import {AppDataSource} from './DataSource';
import {DataSource} from 'typeorm';
import {TestAppDataSource} from '../../../../tests/TestAppDataSource';

export const getDataSource = (): DataSource => {
    return process.env.NODE_ENV === 'test' ? TestAppDataSource : AppDataSource;
};
