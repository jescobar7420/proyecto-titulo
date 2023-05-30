import pool from '../database/pool';
import { Supermercado } from '../interfaces/Supermercado';

export const getSupermercados = async (limit?: number): Promise<Supermercado[]> => {
  let query = `SELECT s.id_supermercado, s.supermercado 
               FROM supermercados AS s
               ORDER BY s.supermercado ASC`;
  if (limit) {
    query += ` LIMIT ${limit}`;
  }
  const { rows } = await pool.query(query);
  return rows;
};

export const getSupermercadoById = async (id: number): Promise<Supermercado> => {
  const { rows } = await pool.query('SELECT * FROM supermercados WHERE id_supermercado = $1', [id]);
  return rows[0];
};

export const createSupermercado = async (supermercado: string, logo: string): Promise<Supermercado> => {
  const { rows } = await pool.query('INSERT INTO supermercados (supermercado, logo) VALUES ($1, $2) RETURNING *', [supermercado, logo]);
  return rows[0];
};

export const updateSupermercado = async (id: number, supermercado: string, logo: string): Promise<Supermercado> => {
  const { rows } = await pool.query('UPDATE supermercados SET supermercado = $1, logo = $2 WHERE id_supermercado = $3 RETURNING *', [supermercado, logo, id]);
  return rows[0];
};

export const deleteSupermercadoById = async (id: number): Promise<boolean> => {
  const result = await pool.query('DELETE FROM supermercados WHERE id_supermercado = $1', [id]);
  return result.rowCount > 0;
};
