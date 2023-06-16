import pool from '../database/pool';
import { Product } from '../interfaces/Product';
import { ProductCard } from '../interfaces/ProductCard';
import { SupermarketComparisonCard } from '../interfaces/SupermarketComparisonCard';
import { CartProduct } from '../interfaces/cartProduct';

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
  let orderColumn: string = "sub.nombre";
  let orderDirection: string = "ASC";
  
  switch (filters.order) {
    case "precio_asc":
      orderColumn = "sub.precio";
      orderDirection = "ASC";
      break;
    case "precio_desc":
      orderColumn = "sub.precio";
      orderDirection = "DESC";
      break;
    case "nombre_asc":
      orderColumn = "sub.nombre";
      orderDirection = "ASC";
      break;
    case "nombre_desc":
      orderColumn = "sub.nombre";
      orderDirection = "DESC";
      break;
  }

  let query = `
    SELECT 
      sub.id_producto,
      sub.id_supermercado,
      sub.nombre,
      sub.marca,
      sub.categoria,
      sub.tipo,
      sub.imagen,
      sub.precio,
      sub.flag_oferta
    FROM (
      SELECT
        p.id_producto,
        sp.id_supermercado,
        p.nombre,
        m.marca,
		    m.id_marca,
        c.categoria,
		    c.id_categoria,
        t.tipo,
		    t.id_tipo,
        p.imagen,
        COALESCE(sp.precio_oferta, sp.precio_normal) AS precio,
        CASE WHEN sp.precio_oferta IS NOT NULL THEN TRUE ELSE FALSE END AS flag_oferta,
        ROW_NUMBER() OVER (
          PARTITION BY p.id_producto 
          ORDER BY COALESCE(sp.precio_oferta, sp.precio_normal) ASC
        ) AS rn
      FROM 
        productos AS p
        INNER JOIN supermercados_productos AS sp ON p.id_producto = sp.id_producto
        INNER JOIN categorias AS c ON p.categoria = c.id_categoria
        INNER JOIN marcas AS m ON p.marca = m.id_marca
        INNER JOIN tipos AS t ON p.tipo_producto = t.id_tipo
      WHERE 
        sp.disponibilidad = 'Yes'
        ${filters.supermercados ? `AND p.id_producto IN (
          SELECT sp2.id_producto 
          FROM supermercados_productos sp2
          WHERE sp2.disponibilidad = 'Yes'
          AND sp2.id_supermercado IN (${filters.supermercados})
          GROUP BY sp2.id_producto
          HAVING COUNT(DISTINCT sp2.id_supermercado) = ARRAY_LENGTH(string_to_array('${filters.supermercados}', ','), 1)
        )` : ''}
    ) AS sub
    WHERE sub.rn = 1`;

  if (filters.categorias) {
    query += ` AND sub.id_categoria IN (${filters.categorias})`;
  }

  if (filters.tipos) {
    query += ` AND sub.id_tipo IN (${filters.tipos})`;
  }

  if (filters.marcas) {
    query += ` AND sub.id_marca IN (${filters.marcas})`;
  }

  query += ` AND sub.precio::INTEGER BETWEEN ${filters.precioMin} AND ${filters.precioMax}
            ORDER BY ${orderColumn} ${orderDirection}
            LIMIT 20
            OFFSET ${filters.offset}`;
  
  const { rows } = await pool.query(query);
  return rows;
};

export const getTotalResultFilter = async (filters: Filters): Promise<ProductCard[]> => {
  let query = `
    SELECT COUNT(*)
    FROM (
      SELECT
        p.id_producto,
        sp.id_supermercado,
        p.nombre,
        m.marca,
		    m.id_marca,
        c.categoria,
		    c.id_categoria,
        t.tipo,
		    t.id_tipo,
        p.imagen,
        COALESCE(sp.precio_oferta, sp.precio_normal) AS precio,
        CASE WHEN sp.precio_oferta IS NOT NULL THEN TRUE ELSE FALSE END AS flag_oferta,
        ROW_NUMBER() OVER (
          PARTITION BY p.id_producto 
          ORDER BY COALESCE(sp.precio_oferta, sp.precio_normal) ASC
        ) AS rn
      FROM 
        productos AS p
        INNER JOIN supermercados_productos AS sp ON p.id_producto = sp.id_producto
        INNER JOIN categorias AS c ON p.categoria = c.id_categoria
        INNER JOIN marcas AS m ON p.marca = m.id_marca
        INNER JOIN tipos AS t ON p.tipo_producto = t.id_tipo
      WHERE 
        sp.disponibilidad = 'Yes'
        ${filters.supermercados ? `AND p.id_producto IN (
          SELECT sp2.id_producto 
          FROM supermercados_productos sp2
          WHERE sp2.disponibilidad = 'Yes'
          AND sp2.id_supermercado IN (${filters.supermercados})
          GROUP BY sp2.id_producto
          HAVING COUNT(DISTINCT sp2.id_supermercado) = ARRAY_LENGTH(string_to_array('${filters.supermercados}', ','), 1)
        )` : ''}
    ) AS sub
    WHERE sub.rn = 1`;

  if (filters.categorias) {
    query += ` AND sub.id_categoria IN (${filters.categorias})`;
  }

  if (filters.tipos) {
    query += ` AND sub.id_tipo IN (${filters.tipos})`;
  }

  if (filters.marcas) {
    query += ` AND sub.id_marca IN (${filters.marcas})`;
  }

  query += ` AND sub.precio::INTEGER BETWEEN ${filters.precioMin} AND ${filters.precioMax}`;
  
  const { rows } = await pool.query(query);
  return rows;
};

export const getSearchProductByName = async (nombre: string): Promise<void[]> => {
  let query = `SELECT p.id_producto, p.nombre
               FROM productos AS p
               WHERE p.nombre LIKE '%${nombre}%'
               LIMIT 5`;

  const { rows } = await pool.query(query);
  return rows;
};

export const getProductCartById = async (id_producto: number): Promise<CartProduct> => {
  let query = `SELECT p.id_producto,
                      p.nombre,
                      m.marca,
                      p.imagen,
                      min_price.precio,
                      1 AS cantidad
               FROM productos AS p
               INNER JOIN marcas AS m ON p.marca = m.id_marca
               INNER JOIN ( SELECT sp.id_producto,
                                   MIN(COALESCE(sp.precio_oferta, sp.precio_normal)) AS precio
                            FROM supermercados_productos AS sp
                            INNER JOIN ( SELECT id_producto, 
                                              MAX(fecha) AS fecha
                                         FROM supermercados_productos
                                         WHERE id_producto = ${id_producto}
                                         GROUP BY id_producto ) AS sp_max ON sp.id_producto = sp_max.id_producto AND 
                                                                             sp.fecha = sp_max.fecha
                            GROUP BY sp.id_producto ) AS min_price ON p.id_producto = min_price.id_producto`;
  const { rows } = await pool.query(query);
  return rows[0];
};

export const getProductCartByListId = async (ids_producto: string | null): Promise<CartProduct[]> => {
  let query = `SELECT p.id_producto,
                      p.nombre,
                      m.marca,
                      p.imagen,
                      min_price.precio,
                      1 AS cantidad
               FROM productos AS p
               INNER JOIN marcas AS m ON p.marca = m.id_marca
               INNER JOIN ( SELECT sp.id_producto,
                                   MIN(COALESCE(sp.precio_oferta, sp.precio_normal)) AS precio
                            FROM supermercados_productos AS sp
                            INNER JOIN ( SELECT id_producto, 
                                              MAX(fecha) AS fecha
                                         FROM supermercados_productos
                                         WHERE id_producto IN (${ids_producto})
                                         GROUP BY id_producto ) AS sp_max ON sp.id_producto = sp_max.id_producto AND 
                                                                             sp.fecha = sp_max.fecha
                            GROUP BY sp.id_producto ) AS min_price ON p.id_producto = min_price.id_producto`;
  const { rows } = await pool.query(query);
  return rows;
};

const debugQuery = (query: string, params: any[]): string => {
  let i = 0;
  return query.replace(/\$[0-9]+/g, () => {
    if (Array.isArray(params[i])) {
      const arrayString = params[i].toString();
      i++;
      return `ARRAY[${arrayString}]::int[]`;
    } else {
      return params[i++];
    }
  });
};

export const getMostSoughtProducts = async (): Promise<ProductCard[]> => {
  const query = `
    SELECT 
      sub.id_producto,
      sub.id_supermercado,
      sub.nombre,
      sub.marca,
      sub.categoria,
      sub.tipo,
      sub.imagen,
      sub.precio,
      sub.flag_oferta,
      cp_count.cotizaciones_count
    FROM (
      SELECT
          p.id_producto,
          sp.id_supermercado,
          p.nombre,
          m.marca,
          c.categoria,
          t.tipo,
          p.imagen,
          COALESCE(sp.precio_oferta, sp.precio_normal) AS precio,
          CASE WHEN sp.precio_oferta IS NOT NULL THEN TRUE ELSE FALSE END AS flag_oferta,
          ROW_NUMBER() OVER (
            PARTITION BY p.id_producto 
            ORDER BY COALESCE(sp.precio_oferta, sp.precio_normal) ASC
          ) AS rn
      FROM 
          productos AS p
          INNER JOIN supermercados_productos AS sp ON p.id_producto = sp.id_producto
          INNER JOIN categorias AS c ON p.categoria = c.id_categoria
          INNER JOIN marcas AS m ON p.marca = m.id_marca
          INNER JOIN tipos AS t ON p.tipo_producto = t.id_tipo
          INNER JOIN cotizaciones_productos AS cp ON cp.id_producto = p.id_producto
          INNER JOIN cotizaciones AS co ON co.id_cotizacion = cp.id_cotizacion
      WHERE 
          sp.disponibilidad = 'Yes'
          AND DATE_PART('month', co.fecha) = DATE_PART('month', CURRENT_DATE)
          AND DATE_PART('year', co.fecha) = DATE_PART('year', CURRENT_DATE)
    ) AS sub
    INNER JOIN (
      SELECT 
          id_producto,
          COUNT(*) as cotizaciones_count
      FROM 
          cotizaciones_productos
      GROUP BY 
          id_producto
    ) AS cp_count ON cp_count.id_producto = sub.id_producto
    WHERE sub.rn = 1
    ORDER BY cp_count.cotizaciones_count DESC
    LIMIT 20;`;
  const { rows } = await pool.query(query);
  return rows;
};