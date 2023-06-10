import pool from '../database/pool';
import { SupermercadoProducto } from '../interfaces/SupermercadosProductos';
import { ProductSupermarket } from '../interfaces/ProductSupermarket';
import { SupermarketComparisonCard } from '../interfaces/SupermarketComparisonCard';
import { SupermarketProductCard } from '../interfaces/SupermarketProductCard';

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

export const getSupermarketComparisonCards = async (ids_products: string | null): Promise<SupermarketComparisonCard[]> => {
  let query = `
    SELECT
      supermercados.id_supermercado,
      supermercados.supermercado,
      
      (SELECT COUNT(*) 
       FROM supermercados_productos 
       WHERE id_supermercado = supermercados.id_supermercado 
       AND id_producto IN (${ids_products}) 
       AND disponibilidad = 'Yes') AS num_available,
       
      (SELECT COUNT(*) 
       FROM supermercados_productos 
       WHERE id_supermercado = supermercados.id_supermercado 
       AND id_producto IN (${ids_products}) 
       AND precio_oferta IS NOT NULL 
       AND disponibilidad = 'Yes') AS num_on_offer,
       
      (SELECT COUNT(*) 
       FROM supermercados_productos 
       WHERE id_supermercado = supermercados.id_supermercado 
       AND id_producto IN (${ids_products}) 
       AND disponibilidad = 'No') AS num_out_of_stock,
       
      (SELECT COUNT(*) 
       FROM productos 
       WHERE id_producto IN (${ids_products}) 
       AND id_producto NOT IN (
           SELECT id_producto 
           FROM supermercados_productos 
           WHERE id_supermercado = supermercados.id_supermercado
       )) AS num_not_distributed,
       
       (SELECT SUM(CASE 
           WHEN precio_oferta IS NOT NULL THEN CAST(precio_oferta AS INTEGER) 
           ELSE CAST(precio_normal AS INTEGER) 
           END) 
        FROM supermercados_productos 
        WHERE id_supermercado = supermercados.id_supermercado 
        AND id_producto IN (${ids_products}) 
        AND disponibilidad = 'Yes') AS total_value
    FROM supermercados
    ORDER BY total_value ASC;`;
    
  const { rows } = await pool.query(query);
  return rows;
}

export const getSaleProductsSupermarket = async (id_supermarket: string | null, ids_products: string | null): Promise<SupermarketProductCard[]> => {
  let query = `
        SELECT p.id_producto,
               p.nombre,
               m.marca,
               '1'::INT AS cantidad,
          	   p.imagen,
          	   '0'::INT AS precio_total,
               sp.precio_oferta::INT AS precio_unitario
        FROM supermercados_productos AS sp
        JOIN productos AS p ON sp.id_producto = p.id_producto
        JOIN marcas AS m ON p.marca = m.id_marca
        WHERE sp.id_supermercado = ${id_supermarket} AND 
              p.id_producto IN (${ids_products}) AND 
              sp.precio_oferta IS NOT NULL AND 
              sp.disponibilidad = 'Yes'
        ORDER BY p.nombre ASC`;
  
  const { rows } = await pool.query(query);
  return rows;
}

export const getNoDistributeProductsSupermarket = async (id_supermarket: string | null, ids_products: string | null): Promise<SupermarketProductCard[]> => {
  let query = `
        SELECT p.id_producto,
               p.nombre,
               m.marca,
               '1'::INT AS cantidad,
          	   p.imagen,
          	   '0'::INT AS precio_total,
               NULL AS precio_unitario
      FROM productos AS p
      JOIN supermercados_productos AS sp ON p.id_producto = sp.id_producto
      JOIN marcas AS m ON m.id_marca = p.marca
      WHERE p.id_producto IN (${ids_products})
      AND p.id_producto NOT IN (
        SELECT sp.id_producto 
        FROM supermercados_productos AS sp
        WHERE sp.id_supermercado = ${id_supermarket})
      ORDER BY p.nombre ASC`;
    
  const { rows } = await pool.query(query);
  return rows;
}

export const getNoStockProductsSupermarket = async (id_supermarket: string | null, ids_products: string | null): Promise<SupermarketProductCard[]> => {
  let query = `
      SELECT p.id_producto,
               p.nombre,
               m.marca,
               '1'::INT AS cantidad,
          	   p.imagen,
          	   '0'::INT AS precio_total,
               COALESCE(sp.precio_oferta, sp.precio_normal)::INT AS precio_unitario
      FROM productos AS p
      JOIN supermercados_productos AS sp ON p.id_producto = sp.id_producto
      JOIN marcas AS m ON m.id_marca = p.marca
      WHERE sp.id_supermercado = ${id_supermarket} AND 
            p.id_producto IN (${ids_products}) AND 
            sp.disponibilidad = 'No'
      ORDER BY p.nombre ASC`;
    
  const { rows } = await pool.query(query);
  return rows;
}

export const getAvailableProductsSupermarket = async (id_supermarket: string | null, ids_products: string | null): Promise<SupermarketProductCard[]> => {
  let query = `
      SELECT p.id_producto,
               p.nombre,
               m.marca,
               '1'::INT AS cantidad,
          	   p.imagen,
          	   '0'::INT AS precio_total,
               COALESCE(sp.precio_oferta, sp.precio_normal)::INT AS precio_unitario
      FROM productos AS p
      JOIN supermercados_productos AS sp ON p.id_producto = sp.id_producto
      JOIN marcas AS m ON m.id_marca = p.marca
      WHERE sp.id_supermercado = ${id_supermarket} AND 
            p.id_producto IN (${ids_products}) AND 
            sp.disponibilidad = 'Yes' AND
            sp.precio_oferta IS NULL
      ORDER BY p.nombre ASC`;
  
  const { rows } = await pool.query(query);

  return rows;
}

export const getProductsPricesAvailablesSupermarket = async (id_supermarket: string | null, ids_products: string | null): Promise<SupermarketProductCard[]> => {
  let query = `
      SELECT sp.id_producto, 
             COALESCE(sp.precio_oferta, sp.precio_normal)::INT AS precio
      FROM supermercados_productos AS sp
      JOIN productos AS p ON sp.id_producto = p.id_producto
      WHERE sp.id_producto IN (${ids_products}) AND
            sp.id_supermercado = ${id_supermarket} AND
            sp.disponibilidad = 'Yes'`;
  
  const { rows } = await pool.query(query);
  return rows;
}