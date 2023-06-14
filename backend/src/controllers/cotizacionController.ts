import { Request, Response } from 'express';
import * as CotizacionModel from '../models/cotizacion';

export const insertQuotation = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id_usuario, id_supermercado, nombre, monto_total, fecha, ids_products, quantities, prices } = req.body;
        await CotizacionModel.insertQuotation(id_usuario, id_supermercado, nombre, monto_total, fecha, ids_products, quantities, prices);
        res.status(200).json({ message: 'Cotización guardada con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const getQuotationUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const id_usuario = parseInt(req.query.id_usuario as string);
        const order_quotation = req.query.order_quotation as string || null;
        const quotations = await CotizacionModel.getQuotationUser(id_usuario, order_quotation);
        res.status(200).json(quotations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const getProductsQuotation = async (req: Request, res: Response): Promise<any> => {
    try {
        const id_cotizacion = parseInt(req.query.id_cotizacion as string);
        const products = await CotizacionModel.getProductsQuotation(id_cotizacion);
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const getListProductsQuotation = async (req: Request, res: Response): Promise<any> => {
    try {
        const id_cotizacion = parseInt(req.query.id_cotizacion as string);
        const products = await CotizacionModel.getListProductsQuotation(id_cotizacion);
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const deleteQuotation = async (req: Request, res: Response): Promise<void> => {
    const id_cotizacion = parseInt(req.query.id_cotizacion as string);
    if (!id_cotizacion) {
        res.status(400).json({ error: 'Invalid ID' });
        return;
    }
    try {
        await CotizacionModel.deleteQuotation(id_cotizacion);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
