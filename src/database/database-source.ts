import { DataSourceOptions } from "typeorm";
import { DataSource } from "typeorm";
import * as dotenv from 'dotenv';
import { UserEntity } from "../user.entity";


dotenv.config();
export const databaseSourceOption: DataSourceOptions = {
    type: "postgres",
    host: process.env.DB_HOST,
    url: process.env.DATABASE_URL,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: {
        rejectUnauthorized: false,
    },
    entities: [
        UserEntity
    ],
    synchronize: process.env.NODE_ENV !== 'production',
}

export const dataSource = new DataSource(databaseSourceOption)

dataSource.initialize()
    .then(() => {
        console.log('DATABASE CONNECTED');
    })
    .catch((error) => {
        console.log('DATABASE CONNECTION ERROR');

        console.log(error);
    });