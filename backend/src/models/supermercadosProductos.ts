import pool from '../database/pool';
import { SupermercadoProducto } from '../interfaces/SupermercadosProductos';
import { ProductSupermarket } from '../interfaces/ProductSupermarket';

export const getSupermercadosProductos = async (limit?: number): Promise<SupermercadoProducto[]> => {
  let query = 'SELECT * FROM supermercados_productos';
  if (limit) {
    query += ` LIMIT ${limit}`;
  }
  const { rows } = await pool.query(query);
  return rows;
};

export const getSupermercadoProductoByIds = async (id_supermercado: number, id_producto: number): Promise<SupermercadoProducto> => {
  const { rows } = await pool.query('SELECT * FROM supermercados_productos WHERE id_supermercado = $1 AND id_producto = $2', [id_supermercado, id_producto]);
  return rows[0];
};

export const createSupermercadoProducto = async (supermercadoProducto: SupermercadoProducto): Promise<SupermercadoProducto> => {
  const { id_supermercado, id_producto, precio_oferta, precio_normal, url_product, fecha, disponibilidad } = supermercadoProducto;
  const { rows } = await pool.query('INSERT INTO supermercados_productos (id_supermercado, id_producto, precio_oferta, precio_normal, url_product, fecha, disponibilidad) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [id_supermercado, id_producto, precio_oferta, precio_normal, url_product, fecha, disponibilidad]);
  return rows[0];
};

export const updateSupermercadoProducto = async (supermercadoProducto: SupermercadoProducto): Promise<SupermercadoProducto> => {
  const { id_supermercado, id_producto, precio_oferta, precio_normal, url_product, fecha, disponibilidad } = supermercadoProducto;
  const { rows } = await pool.query('UPDATE supermercados_productos SET precio_oferta = $1, precio_normal = $2, url_product = $3, fecha = $4, disponibilidad = $5 WHERE id_supermercado = $6 AND id_producto = $7 RETURNING *', [precio_oferta, precio_normal, url_product, fecha, disponibilidad, id_supermercado, id_producto]);
  return rows[0];
};


export const deleteSupermercadoProductoByIds = async (id_supermercado: number, id_producto: number): Promise<boolean> => {
  const result = await pool.query('DELETE FROM supermercados_productos WHERE id_supermercado = $1 AND id_producto = $2', [id_supermercado, id_producto]);
  return result.rowCount > 0;
};

export const getProductoAtSupermercado = async (id_producto: number): Promise<ProductSupermarket[]> => {
  let query = `
      SELECT s.id_supermercado,
             s.supermercado AS nombre_supermercado,
             s.logo AS logo_supermercado,
             sp.precio_normal,
             sp.precio_oferta,
             CASE
                 WHEN sp.disponibilidad = 'Yes' THEN 'Disponible'
                 WHEN sp.disponibilidad = 'No' THEN 'Sin stock'
                 ELSE sp.disponibilidad
             END AS disponibilidad,
             sp.url_product AS url_producto,
             sp.fecha
      FROM supermercados_productos AS sp
      JOIN supermercados AS s ON sp.id_supermercado = s.id_supermercado
      WHERE sp.id_producto = ${id_producto} AND 
        sp.precio_normal IS NOT NULL
      ORDER BY LEAST(sp.precio_normal, COALESCE(sp.precio_oferta, sp.precio_normal)) ASC;`;
  const { rows } = await pool.query(query);
  return rows;
}