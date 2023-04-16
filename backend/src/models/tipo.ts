import pool from '../database/pool'
import { Tipo } from '../interfaces/Tipo';

export const getTipos = async (limit?: number): Promise<Tipo[]> => {
  let query = 'SELECT * FROM tipos';
  if (limit) {
    query += ` LIMIT ${limit}`;
  }
  const { rows } = await pool.query(query);
  return rows;
};

export const getTipoById = async (id: number): Promise<Tipo> => {
  const { rows } = await pool.query('SELECT * FROM tipos WHERE id_tipo = $1', [id]);
  return rows[0];
};

export const createTipo = async (tipo: string): Promise<Tipo> => {
  const { rows } = await pool.query('INSERT INTO tipos (tipo) VALUES ($1) RETURNING *', [tipo]);
  return rows[0];
};

export const updateTipo = async (id: number, tipo: string): Promise<Tipo> => {
  const { rows } = await pool.query('UPDATE tipos SET tipo = $1 WHERE id_tipo = $2 RETURNING *', [tipo, id]);
  return rows[0];
};

export const deleteTipoById = async (id: number): Promise<boolean> => {
  const result = await pool.query('DELETE FROM tipos WHERE id_tipo = $1', [id]);
  return result.rowCount > 0;
};
