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

export const resetTokenUser = async (id: string) => {
    let query = `UPDATE usuarios SET reset_token = null WHERE id_usuario = ${id}`;
    const result = await pool.query(query);
    return result.rows[0];
}

export const storeUserToken = async (id: string, token: string) => {
    const query = `UPDATE usuarios SET reset_token = '${token}' WHERE id_usuario = ${id}`;
    const result = await pool.query(query);
    return result.rowCount > 0;
};

export const getResetToken = async(email: string) => {
    const query = `SELECT reset_token FROM usuarios WHERE email = '${email}'`;
    const result = await pool.query(query);
    return result.rows[0];
};

export const updatePassword = async (email: string, hashedPassword: string) => {
    const query = `UPDATE usuarios SET password = $1 WHERE email = $2`;
    const values = [hashedPassword, email];
    const result = await pool.query(query, values);
    return result.rowCount > 0;
};