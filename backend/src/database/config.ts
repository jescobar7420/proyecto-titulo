import dotenv from 'dotenv';
import { PoolConfig } from 'pg';

dotenv.config();

const dbConfig: PoolConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
};

export default dbConfig;