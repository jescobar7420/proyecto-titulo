import pool from '../database/pool'
import { Product } from '../interfaces/Product';
import { ProductCard } from '../interfaces/ProductCard';

export const getProducts = async (limit?: number): Promise<Product[]> => {
  let query = 'SELECT * FROM productos';
  if (limit) {
    query += ` LIMIT ${limit}`;
  }
  const { rows } = await pool.query(query);
  return rows;
};

export const getProductById = async (id: number): Promise<Product> => {
  const { rows } = await pool.query('SELECT * FROM productos WHERE id_producto = $1', [id]);
  return rows[0];
};

export const createProduct = async (product: Product): Promise<void> => {
  const { categoria, marca, tipo_producto, nombre, imagen, descripcion, ingredientes } = product;
  await pool.query(
    'INSERT INTO productos (categoria, marca, tipo_producto, nombre, imagen, descripcion, ingredientes) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [categoria, marca, tipo_producto, nombre, imagen, descripcion, ingredientes]
  );
};

export const updateProduct = async (id: number, product: Product): Promise<Product | null> => {
  const { categoria, marca, tipo_producto, nombre, imagen, descripcion, ingredientes } = product;
  const result = await pool.query(
    'UPDATE productos SET categoria=$1, marca=$2, tipo_producto=$3, nombre=$4, imagen=$5, descripcion=$6, ingredientes=$7 WHERE id_producto=$8 RETURNING *',
    [categoria, marca, tipo_producto, nombre, imagen, descripcion, ingredientes, id]
  );
  return result.rowCount ? result.rows[0] : null;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await pool.query('DELETE FROM productos WHERE id_producto = $1', [id]);
};

export const getAvailableProductCards = async (limit: number): Promise<ProductCard[]> => {
  const query = `
      SELECT p.nombre, 
             m.marca AS marca, 
             t.tipo AS tipo_producto, 
             sp.url_product, 
             MIN(COALESCE(sp.precio_oferta, sp.precio_normal)) AS mejor_precio
      FROM productos p 
      JOIN marcas m ON p.marca = m.id_marca
      JOIN tipos t ON p.tipo_producto = t.id_tipo
      JOIN supermercados_productos sp ON p.id_producto = sp.id_producto
      WHERE sp.disponibilidad = 'Yes'
      GROUP BY p.nombre, m.marca, t.tipo, sp.url_product
      LIMIT ${limit}
  `;
  const { rows } = await pool.query(query);
  return rows;
};