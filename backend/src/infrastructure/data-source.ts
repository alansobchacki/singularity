import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: process.env.DB_TYPE as 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/src/infrastructure/migrations/*.js'],
  logging: false,
  migrationsRun: true,
};

export const dataSource = new DataSource(dataSourceOptions);

dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    console.log('Running migrations');
    return dataSource.runMigrations();
  })
  .then(() => {
    console.log('Migrations successfully run');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
