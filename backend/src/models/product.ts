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
  const query = `SELECT p.id_producto, 
                        c.categoria, 
                        m.marca, 
                        t.tipo AS tipo_producto, 
                        p.nombre, 
                        p.imagen, 
                        p.descripcion, 
                        p.ingredientes
                 FROM productos AS p
                 JOIN categorias AS c ON p.categoria = c.id_categoria
                 JOIN marcas AS m ON p.marca = m.id_marca
                 JOIN tipos AS t ON p.tipo_producto = t.id_tipo
                 WHERE p.id_producto = $1;`;
  const { rows } = await pool.query(query, [id]);
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
          SELECT p.id_producto,
                 sm.id_supermercado,
                 p.nombre, 
                 m.marca,
                 c.categoria,
                 t.tipo, 
                 p.imagen, 
                 sm_precio_min.precio_minimo AS precio,
                 (sm_precio_min.precio_minimo = sm_precio_min.precio_oferta) AS flag_oferta,
                 sm.logo AS logo_supermercado,
                 sm_precio_min.fecha
          FROM productos p 
          JOIN marcas m ON p.marca = m.id_marca
          JOIN categorias c ON p.categoria = c.id_categoria
          JOIN tipos t ON p.tipo_producto = t.id_tipo
          JOIN (
            SELECT sp.id_producto,
                   sp.id_supermercado,
                   MIN(COALESCE(sp.precio_oferta, sp.precio_normal)) AS precio_minimo,
                   sp.precio_oferta,
                   MAX(sp.fecha) AS fecha
            FROM supermercados_productos sp
            WHERE sp.disponibilidad = 'Yes'
            GROUP BY sp.id_producto, sp.id_supermercado, sp.precio_oferta
        ) sm_precio_min ON sm_precio_min.id_producto = p.id_producto
        JOIN supermercados sm ON sm.id_supermercado = sm_precio_min.id_supermercado
        WHERE sm_precio_min.precio_minimo IN (
            SELECT MIN(COALESCE(sp2.precio_oferta, sp2.precio_normal))
            FROM supermercados_productos sp2
            WHERE sp2.id_producto = p.id_producto AND sp2.disponibilidad = 'Yes'
        )
        ORDER BY p.id_producto
        LIMIT ${limit} 
        OFFSET 10`;
  const { rows } = await pool.query(query);
  return rows;
};

export const getProductCardById = async (id: number): Promise<ProductCard> => {
  const query = `
      SELECT p.id_producto,
             min_price.id_supermercado,
             p.nombre, 
             m.marca AS marca,
             c.categoria AS categoria,
             t.tipo AS tipo, 
             MAX(p.imagen) AS imagen, 
             min_price.precio,
             min_price.flag_oferta,
             min_price.logo_supermercado,
             max_date.fecha_reciente
      FROM productos p 
      JOIN marcas m ON p.marca = m.id_marca
      JOIN tipos t ON p.tipo_producto = t.id_tipo
      JOIN categorias AS c ON p.categoria = c.id_categoria
      JOIN (
        SELECT sp.id_producto,
              s.id_supermercado,
              MIN(COALESCE(sp.precio_oferta, sp.precio_normal)) AS precio,
              (MIN(CASE WHEN sp.precio_oferta IS NOT NULL THEN 1 ELSE 0 END) = 1) AS flag_oferta,
              s.logo AS logo_supermercado
        FROM supermercados_productos sp
        JOIN supermercados s ON s.id_supermercado = sp.id_supermercado
        WHERE sp.disponibilidad = 'Yes'
        GROUP BY sp.id_producto, s.id_supermercado
      ) AS min_price ON min_price.id_producto = p.id_producto
      JOIN (
        SELECT sp.id_producto, MAX(sp.fecha) AS fecha_reciente
        FROM supermercados_productos sp
        WHERE sp.disponibilidad = 'Yes'
        GROUP BY sp.id_producto
      ) AS max_date ON max_date.id_producto = p.id_producto
      WHERE p.id_producto = ${id}
      GROUP BY p.id_producto, min_price.id_supermercado, p.nombre, m.marca, c.categoria, t.tipo, min_price.precio, min_price.flag_oferta, min_price.logo_supermercado, max_date.fecha_reciente`;
  const { rows } = await pool.query(query);
  return rows[0];
};

export const productsFilter = async (filters: Filters): Promise<ProductCard[]> => {
  let orderColumn: string = "p.nombre";
  let orderDirection: string = "ASC";
  
  switch (filters.order) {
    case "precio_asc":
      orderColumn = "sm_precio_min.precio_minimo";
      orderDirection = "ASC";
      break;
    case "precio_desc":
      orderColumn = "sm_precio_min.precio_minimo";
      orderDirection = "DESC";
      break;
    case "nombre_asc":
      orderColumn = "p.nombre";
      orderDirection = "ASC";
      break;
    case "nombre_desc":
      orderColumn = "p.nombre";
      orderDirection = "DESC";
      break;
  }
  
  let query = `
    SELECT p.id_producto,
           sm.id_supermercado,
           p.nombre, 
           m.marca,
           c.categoria,
           t.tipo, 
           p.imagen, 
           sm_precio_min.precio_minimo AS precio,
           (sm_precio_min.precio_minimo = sm_precio_min.precio_oferta) AS flag_oferta,
           sm.logo AS logo_supermercado,
           sm_precio_min.fecha
    FROM productos p 
    JOIN marcas m ON p.marca = m.id_marca
    JOIN categorias c ON p.categoria = c.id_categoria
    JOIN tipos t ON p.tipo_producto = t.id_tipo
    JOIN (
      SELECT sp.id_producto,
             sp.id_supermercado,
             MIN(COALESCE(sp.precio_oferta, sp.precio_normal)) AS precio_minimo,
             sp.precio_oferta,
             MAX(sp.fecha) AS fecha
      FROM supermercados_productos sp
      WHERE sp.disponibilidad = 'Yes'
      GROUP BY sp.id_producto, sp.id_supermercado, sp.precio_oferta
    ) sm_precio_min ON sm_precio_min.id_producto = p.id_producto
    JOIN supermercados sm ON sm.id_supermercado = sm_precio_min.id_supermercado
    WHERE sm_precio_min.precio_minimo IN (
      SELECT MIN(COALESCE(sp2.precio_oferta, sp2.precio_normal))
      FROM supermercados_productos sp2
      WHERE sp2.id_producto = p.id_producto AND sp2.disponibilidad = 'Yes'
    )`;
    
  if (filters.supermercados) {
    query += `AND sm.id_supermercado IN (${filters.supermercados})`;
  }
  
  if (filters.categorias) {
    query += `AND c.id_categoria IN (${filters.categorias})`;
  }
  
  if (filters.tipos) {
    query += `AND t.id_tipo IN (${filters.tipos})`;
  }
  
  if (filters.marcas) {
    query += `AND m.id_marca IN (${filters.marcas})`;
  }
      
  query += `AND sm_precio_min.precio_minimo::INTEGER BETWEEN ${filters.precioMin} AND ${filters.precioMax}
            ORDER BY ${orderColumn} ${orderDirection}
            LIMIT 20
            OFFSET ${filters.offset}`;
  const { rows } = await pool.query(query);
  return rows;
};

export const getTotalResultFilter = async (filters: Filters): Promise<ProductCard[]> => { 
  let query = `
    SELECT COUNT(*)
    FROM (SELECT p.id_producto,
                 sm.id_supermercado,
                 p.nombre, 
                 m.marca,
                 c.categoria,
                 t.tipo, 
                 p.imagen, 
                 sm_precio_min.precio_minimo AS precio,
                 (sm_precio_min.precio_minimo = sm_precio_min.precio_oferta) AS flag_oferta,
                 sm.logo AS logo_supermercado,
                 sm_precio_min.fecha
          FROM productos p 
          JOIN marcas m ON p.marca = m.id_marca
          JOIN categorias c ON p.categoria = c.id_categoria
          JOIN tipos t ON p.tipo_producto = t.id_tipo
          JOIN (
           SELECT sp.id_producto,
                  sp.id_supermercado,
                  MIN(COALESCE(sp.precio_oferta, sp.precio_normal)) AS precio_minimo,
                  sp.precio_oferta,
                  MAX(sp.fecha) AS fecha
           FROM supermercados_productos sp
           WHERE sp.disponibilidad = 'Yes'
           GROUP BY sp.id_producto, sp.id_supermercado, sp.precio_oferta
          ) sm_precio_min ON sm_precio_min.id_producto = p.id_producto
          JOIN supermercados sm ON sm.id_supermercado = sm_precio_min.id_supermercado
          WHERE sm_precio_min.precio_minimo IN (
           SELECT MIN(COALESCE(sp2.precio_oferta, sp2.precio_normal))
           FROM supermercados_productos sp2
           WHERE sp2.id_producto = p.id_producto AND sp2.disponibilidad = 'Yes'
          )`;
    
  if (filters.supermercados) {
    query += `AND sm.id_supermercado IN (${filters.supermercados})`;
  }
  
  if (filters.categorias) {
    query += `AND c.id_categoria IN (${filters.categorias})`;
  }
  
  if (filters.tipos) {
    query += `AND t.id_tipo IN (${filters.tipos})`;
  }
  
  if (filters.marcas) {
    query += `AND m.id_marca IN (${filters.marcas})`;
  }
      
  query += `AND sm_precio_min.precio_minimo::INTEGER BETWEEN ${filters.precioMin} AND ${filters.precioMax}) AS total_result`;
  
  const { rows } = await pool.query(query);
  return rows;
};
