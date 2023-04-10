import { QueryResult } from 'pg';
import pool from '../database/pool';

export interface Marca {
    id: number;
    nombre: string;
  }

export async function getMarcas(limit: number): Promise<Marca[]> {
  const { rows } = await pool.query<Marca>('SELECT * FROM marcas LIMIT $1', [limit]);
  return rows;
}

export async function getMarcaById(id: number): Promise<Marca | null> {
  const { rows } = await pool.query<Marca>('SELECT * FROM marcas WHERE id_marca = $1', [id]);
  return rows.length ? rows[0] : null;
}

export async function createMarca(marca: Marca): Promise<QueryResult> {
  const { nombre } = marca;
  return pool.query(
    'INSERT INTO marcas (marca) VALUES ($1)',
    [nombre]
  );
}

export async function updateMarca(id: number, marca: Marca): Promise<QueryResult> {
  const { nombre } = marca;
  return pool.query(
    'UPDATE marcas SET marca = $2 WHERE id_marca = $1',
    [id, nombre]
  );
}

export async function deleteProducto(id: number): Promise<QueryResult> {
  return pool.query('DELETE FROM marcas WHERE id_marca = $1', [id]);
}