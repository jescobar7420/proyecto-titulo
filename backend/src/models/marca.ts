import pool from '../database/pool'
import { Marca } from '../interfaces/Marca';

export const getMarcas = async (limit?: number): Promise<Marca[]> => {
  let query = 'SELECT * FROM marcas';
  if (limit) {
    query += ` LIMIT ${limit}`;
  }
  const { rows } = await pool.query(query);
  return rows;
};

export const getMarcaById = async (id: number): Promise<Marca> => {
  const { rows } = await pool.query('SELECT * FROM marcas WHERE id_marca = $1', [id]);
  return rows[0];
};

export const createMarca = async (marca: string): Promise<Marca> => {
  const { rows } = await pool.query('INSERT INTO marcas (marca) VALUES ($1) RETURNING *', [marca]);
  return rows[0];
};

export const updateMarca = async (id: number, marca: string): Promise<Marca> => {
  const { rows } = await pool.query('UPDATE marcas SET marca = $1 WHERE id_marca = $2 RETURNING *', [marca, id]);
  return rows[0];
};

export const deleteMarcaById = async (id: number): Promise<boolean> => {
  const result = await pool.query('DELETE FROM marcas WHERE id_marca = $1', [id]);
  return result.rowCount > 0;
};