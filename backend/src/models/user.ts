import pool from '../database/pool';
import { User } from '../interfaces/User';

export const createUser = async (name: string, email: string, passwordHash: string) => {
    let query = `INSERT INTO usuarios (nombre, email, password) 
                 VALUES ($1, $2, $3) 
                 RETURNING id_usuario, nombre, email`;
    const result = await pool.query(query, [name, email, passwordHash]);
    return result.rows[0];
};

export const getUserByEmail = async (email: string) => {
    let query = `SELECT * FROM usuarios WHERE email = $1`;
    const result = await pool.query(query, [email]);
    return result.rows[0];
};

export const getUserById = async (id: string) => {
    const query = `SELECT * FROM usuarios WHERE id_usuario = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

export const resetTokenUser = async (id: string) => {
    let query = `UPDATE usuarios SET reset_token = null WHERE id_usuario = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

export const storeUserToken = async (id: string, token: string) => {
    const query = `UPDATE usuarios SET reset_token = $1 WHERE id_usuario = $2`;
    const result = await pool.query(query, [token, id]);
    return result.rowCount > 0;
};

export const getResetToken = async(email: string) => {
    const query = `SELECT reset_token FROM usuarios WHERE email = $1`;
    const result = await pool.query(query, [email]);
    return result.rows[0];
};

export const updatePassword = async (email: string, hashedPassword: string) => {
    const query = `UPDATE usuarios SET password = $1 WHERE email = $2`;
    const result = await pool.query(query, [hashedPassword, email]);
    return result.rowCount > 0;
};
