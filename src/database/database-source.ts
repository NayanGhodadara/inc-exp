import { DataSourceOptions } from "typeorm";
import { DataSource } from "typeorm";
import * as dotenv from 'dotenv';


dotenv.config();
export const databaseSourceOption: DataSourceOptions = {
    type: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: {
        rejectUnauthorized: false,
    },
    entities: [],
    synchronize: process.env.NODE_ENV !== 'production',
}

export const dataSource = new DataSource(databaseSourceOption)