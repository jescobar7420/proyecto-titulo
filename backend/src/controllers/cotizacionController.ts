import { Request, Response } from 'express';
import * as CotizacionModel from '../models/cotizacion';

export const insertQuotation = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id_usuario, id_supermercado, nombre, monto_total, fecha, ids_products, quantities } = req.body;
        await CotizacionModel.insertQuotation(id_usuario, id_supermercado, nombre, monto_total, fecha, ids_products, quantities);
        res.status(200).json({ message: 'Cotización guardada con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}
