import pool from '../database/pool'
import { Tipo } from '../interfaces/Tipo';
import { TiposByCategoria } from '../interfaces/TipoByCategorias';

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

export const getTiposByCategory = async (): Promise<TiposByCategoria[]> => {
  let query = `SELECT c.id_categoria AS id_categoria,
                      t.id_tipo AS id_tipo,
                      t.tipo AS tipo
               FROM productos AS p
               JOIN categorias c ON p.categoria = c.id_categoria
               JOIN tipos t ON p.tipo_producto = t.id_tipo
               GROUP BY c.id_categoria, t.id_tipo, t.tipo
               ORDER BY t.tipo ASC`;
               
  const { rows } = await pool.query(query);
  return rows;
}

export const getTypesByCategoryBrand = async (id_category: string | null, id_marca: string | null): Promise<Tipo[]> => {
  let query = `
    SELECT DISTINCT t.id_tipo, t.tipo
    FROM productos AS p
    JOIN tipos AS t ON t.id_tipo = p.tipo_producto
    WHERE 1 = 1 AND t.tipo IS NOT NULL`;

  if (id_category) {
    query += ` AND p.categoria IN (${id_category})`;
  }

  if (id_marca) {
    query += ` AND p.marca IN (${id_marca})`;
  }

  query += ' ORDER BY t.tipo ASC';
  const { rows } = await pool.query(query);
  return rows;
};

export const getTypesByBrands = async (id_marca: string | null): Promise<Tipo[]> => {
  let query = `SELECT DISTINCT t.id_tipo, t.tipo
               FROM productos AS p
               JOIN tipos AS t ON p.tipo_producto = t.id_tipo
               WHERE p.marca IN (${id_marca})
               ORDER BY t.tipo;`;
  const { rows } = await pool.query(query);
  return rows;
};