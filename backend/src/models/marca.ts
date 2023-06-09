import pool from '../database/pool'
import { Marca } from '../interfaces/Marca';
import { MarcaByCategoria } from '../interfaces/MarcaByCategorias';

export const getMarcas = async (limit?: number): Promise<Marca[]> => {
  let query = `SELECT m.id_marca, m.marca 
               FROM marcas AS m
               ORDER BY m.marca ASC`;
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

export const getBrandsByCategoryType = async (id_category: string | null, id_tipo: string | null): Promise<Marca[]> => {
  let query = `
    SELECT DISTINCT m.id_marca, m.marca
    FROM productos AS p
    JOIN marcas AS m ON m.id_marca = p.marca
    WHERE 1 = 1`;

  if (id_category) {
    query += ` AND p.categoria IN (${id_category})`;
  }

  if (id_tipo) {
    query += ` AND p.tipo_producto IN (${id_tipo})`;
  }

  query += ' ORDER BY m.marca ASC';
  const { rows } = await pool.query(query);
  return rows;
};

export const getMarcaByCategory = async (): Promise<MarcaByCategoria[]> => {
  let query = `SELECT c.id_categoria AS id_categoria,
                      m.id_marca AS id_marca,
                      m.marca AS marca
               FROM productos AS p
               JOIN categorias c ON p.categoria = c.id_categoria
               JOIN marcas m ON p.marca = m.id_marca
               GROUP BY c.id_categoria, m.id_marca, m.marca
               ORDER BY m.marca ASC`;
               
  const { rows } = await pool.query(query);
  return rows;
}

export const getBrandsByTypes = async (id_tipos: string | null): Promise<Marca[]> => {
  let query = `SELECT DISTINCT m.id_marca, m.marca
               FROM productos AS p
               JOIN marcas AS m ON p.marca = m.id_marca
               WHERE p.tipo_producto IN (${id_tipos}) AND m.marca IS NOT NULL
               ORDER BY m.marca;`;
  
  const { rows } = await pool.query(query);
  return rows;
};