import pool from '../database/pool';
import { Categoria } from '../interfaces/Categoria';

export const getCategorias = async (limit?: number): Promise<Categoria[]> => {
  let query = `SELECT id_categoria, categoria 
               FROM categorias AS c
               ORDER BY c.categoria ASC`;
  if (limit) {
    query += ` LIMIT ${limit}`;
  }
  const { rows } = await pool.query(query);
  return rows;
};

export const getCategoriaById = async (id: number): Promise<Categoria> => {
  const { rows } = await pool.query('SELECT * FROM categorias WHERE id_categoria = $1', [id]);
  return rows[0];
};

export const createCategoria = async (categoria: string): Promise<Categoria> => {
  const { rows } = await pool.query('INSERT INTO categorias (categoria) VALUES ($1) RETURNING *', [categoria]);
  return rows[0];
};

export const updateCategoria = async (id: number, categoria: string): Promise<Categoria> => {
  const { rows } = await pool.query('UPDATE categorias SET categoria = $1 WHERE id_categoria = $2 RETURNING *', [categoria, id]);
  return rows[0];
};

export const deleteCategoriaById = async (id: number): Promise<boolean> => {
  const result = await pool.query('DELETE FROM categorias WHERE id_categoria = $1', [id]);
  return result.rowCount > 0;
};

export const getCategoriasMarcasTipos = async (): Promise<any> => {
  let query = `SELECT c.id_categoria AS id_categoria,
                      m.marca AS marca,
                      t.tipo AS tipo
               FROM productos AS p
               JOIN categorias c ON p.categoria = c.id_categoria
               JOIN marcas m ON p.marca = m.id_marca
               JOIN tipos t ON p.tipo_producto = t.id_tipo`;

  const { rows } = await pool.query(query);
  return rows;
};