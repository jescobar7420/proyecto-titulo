import dotenv from 'dotenv';
import { PoolConfig } from 'pg';

dotenv.config();

const dbConfig: PoolConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432')
};

export const LIMIT_PER_PAGE = 10;

export default dbConfig;