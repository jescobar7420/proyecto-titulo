import pool from '../database/pool'
import { QuotationDetail } from '../interfaces/Cotizacion';
import { SupermarketProductCard } from '../interfaces/SupermarketProductCard';

export const insertQuotation = async (id_usuario: number, id_supermercado: number, nombre: string, monto_total: number, fecha: string, ids_products: string[], quantities: number[], prices: number[]): Promise<void> => {
    // Iniciar una transacción
    await pool.query('BEGIN');
    try {
        // Primero, insertar en la tabla cotizaciones
        const insertCotizacionQuery = `
          INSERT INTO cotizaciones (id_usuario, id_supermercado, nombre, monto_total, fecha) 
          VALUES ($1, $2, $3, $4, $5) 
          RETURNING id_cotizacion`;

        const cotizacionValues = [id_usuario, id_supermercado, nombre, monto_total, fecha];

        const cotizacionResult = await pool.query(insertCotizacionQuery, cotizacionValues);
        const id_cotizacion = cotizacionResult.rows[0].id_cotizacion;

        // Luego, insertar en la tabla cotizaciones_productos
        for (let i = 0; i < ids_products.length; i++) {
            const insertCotizacionProductoQuery = `
            INSERT INTO cotizaciones_productos (id_cotizacion, id_producto, cantidad, precio) 
            VALUES ($1, $2, $3, $4)`;

            const cotizacionProductoValues = [id_cotizacion, ids_products[i], quantities[i], prices[i]];

            await pool.query(insertCotizacionProductoQuery, cotizacionProductoValues);
        }

        // Si todo sale bien, hacer commit a la transacción
        await pool.query('COMMIT');
    } catch (error) {
        // Si algo sale mal, hacer rollback a la transacción
        await pool.query('ROLLBACK');
        throw error;
    }
};

export const getQuotationUser = async (id_usuario: number, order_quotation: string | null): Promise<QuotationDetail[]> => {
    let query = `SELECT c.id_cotizacion,
                        s.supermercado,
                        c.nombre,
                        c.monto_total,
                        c.fecha
                 FROM cotizaciones AS c
                 JOIN supermercados AS s ON c.id_supermercado = s.id_supermercado
                 WHERE c.id_usuario = ${id_usuario} `;

    switch(order_quotation) {
        case 'cotizaciones_desc':
            query += 'ORDER BY c.fecha DESC';
            break;
        case 'cotizaciones_asc':
            query += 'ORDER BY c.fecha ASC';
            break;
        case 'nombre_asc':
            query += 'ORDER BY c.nombre ASC';
            break;
        case 'nombre_desc':
            query += 'ORDER BY c.nombre DESC';
            break;
        case 'precio_desc':
            query += 'ORDER BY c.monto_total DESC';
            break;
        case 'precio_asc':
            query += 'ORDER BY c.monto_total ASC';
            break;
        default:
            query += 'ORDER BY c.fecha DESC';
    }
    const { rows } = await pool.query(query);
    return rows;
};

export const getProductsQuotation = async (id_cotizacion: number): Promise<SupermarketProductCard[]> => {
    let query = `SELECT cp.id_producto,
                        p.nombre,
                        m.marca,
                        cp.cantidad,
                        p.imagen,
                        (cp.cantidad * cp.precio) AS precio_total,
                        cp.precio AS precio_unitario
                 FROM cotizaciones AS c
                 JOIN supermercados AS s ON c.id_supermercado = s.id_supermercado
                 JOIN cotizaciones_productos AS cp ON cp.id_cotizacion = c.id_cotizacion
                 JOIN productos AS p ON p.id_producto = cp.id_producto
                 JOIN marcas AS m ON m.id_marca = p.marca
                 WHERE c.id_cotizacion = ${id_cotizacion}
                 ORDER BY precio_total ASC`;
    const { rows } = await pool.query(query);
    return rows;
};


export const getListProductsQuotation = async (id_cotizacion: number): Promise<string> => {
    let query = `SELECT cp.id_producto
                 FROM cotizaciones_productos AS cp
                 WHERE cp.id_cotizacion = ${id_cotizacion}`;
    
    const { rows } = await pool.query(query);
  
    const listProducts = rows.map(row => row.id_producto === null ? "null" : row.id_producto);
    const listProductsString = listProducts.join(',');
    return listProductsString;
};

export const deleteQuotation = async (id_cotizacion: number): Promise<void> => {
    await pool.query('DELETE FROM cotizaciones WHERE id_cotizacion = $1', [id_cotizacion]);
};