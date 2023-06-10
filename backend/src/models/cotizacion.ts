import pool from '../database/pool'

export const insertQuotation = async (id_usuario: number, id_supermercado: number, nombre:string, monto_total: number, fecha: string, ids_products: string[], quantities: number[]): Promise<void> => {
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
            INSERT INTO cotizaciones_productos (id_cotizacion, id_producto, cantidad) 
            VALUES ($1, $2, $3)`;

            const cotizacionProductoValues = [id_cotizacion, ids_products[i], quantities[i]];

            await pool.query(insertCotizacionProductoQuery, cotizacionProductoValues);
        }

        // Si todo sale bien, hacer commit a la transacción
        await pool.query('COMMIT');
    } catch (error) {
        // Si algo sale mal, hacer rollback a la transacción
        await pool.query('ROLLBACK');
        throw error;
    }
}
