import pool from '../database/pool';
import { User } from '../interfaces/User';

export const createUser = async (name: string, email: string, passwordHash: string) => {
    let query = `INSERT INTO usuarios (nombre, email, password) 
                 VALUES ('${name}', '${email}', '${passwordHash}') 
                 RETURNING id_usuario, nombre, email`;
    const result = await pool.query(query);
    return result.rows[0];
};

export const getUserByEmail = async (email: string) => {
    let query = `SELECT * FROM usuarios WHERE email = '${email}'`;
    const result = await pool.query(query);
    return result.rows[0];
};

export const getUserById = async (id: string) => {
    const query = `SELECT * FROM usuarios WHERE id_usuario = ${id}`;

    const result = await pool.query(query);
    return result.rows[0];
};