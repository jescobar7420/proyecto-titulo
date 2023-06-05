import { Request, Response } from 'express';

import * as SupermercadoProductoModel from '../models/supermercadosProductos';
import { SupermercadoProducto } from '../interfaces/SupermercadosProductos';
import { ProductSupermarket } from '../interfaces/ProductSupermarket';

export const getSupermercadosProductos = async (req: Request, res: Response): Promise<void> => {
  try {
    const supermercadosProductos = await SupermercadoProductoModel.getSupermercadosProductos();
    res.status(200).json(supermercadosProductos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSupermercadoProductoByIds = async (req: Request, res: Response): Promise<void> => {
  const id_supermercado = parseInt(req.params.id_supermercado, 10);
  const id_producto = parseInt(req.params.id_producto, 10);
  if (!id_supermercado || !id_producto) {
    res.status(400).json({ error: 'Invalid IDs' });
    return;
  }
  try {
    const supermercadoProducto = await SupermercadoProductoModel.getSupermercadoProductoByIds(id_supermercado, id_producto);
    if (supermercadoProducto) {
      res.status(200).json(supermercadoProducto);
    } else {
      res.status(404).json({ error: `SupermercadoProducto with IDs (${id_supermercado},${id_producto}) not found` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createSupermercadoProducto = async (req: Request, res: Response): Promise<void> => {
  const { id_supermercado, id_producto, precio_oferta, precio_normal, url_product, fecha, disponibilidad } = req.body;
  if (!id_supermercado || !id_producto || !url_product || !disponibilidad) {
    res.status(400).json({ error: 'Supermercado, producto, url y disponibilidad son campos requeridos' });
    return;
  }
  try {
    const newSupermercadoProducto: SupermercadoProducto = {
      id_supermercado,
      id_producto,
      precio_oferta,
      precio_normal,
      url_product,
      fecha,
      disponibilidad
    };
    const createdSupermercadoProducto = await SupermercadoProductoModel.createSupermercadoProducto(newSupermercadoProducto);
    res.status(201).json(createdSupermercadoProducto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateSupermercadoProducto = async (req: Request, res: Response): Promise<void> => {
  const id_supermercado = parseInt(req.params.id_supermercado, 10);
  const id_producto = parseInt(req.params.id_producto, 10);
  const { precio_oferta, precio_normal, url_product, fecha, disponibilidad } = req.body;
  if (!id_supermercado || !id_producto || !url_product || !disponibilidad) {
    res.status(400).json({ error: 'Invalid IDs or SupermercadoProducto data' });
    return;
  }
  const supermercadoProducto: SupermercadoProducto = {
    id_supermercado,
    id_producto,
    precio_oferta,
    precio_normal,
    url_product,
    fecha,
    disponibilidad
  };
  try {
    const updatedSupermercadoProducto = await SupermercadoProductoModel.updateSupermercadoProducto(supermercadoProducto);
    if (updatedSupermercadoProducto) {
      res.status(200).json(updatedSupermercadoProducto);
    } else {
      res.status(404).json({ error: `SupermercadoProducto with IDs (${id_supermercado},${id_producto}) not found` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProductoAtSupermercado = async (req: Request, res: Response): Promise<void> => {
  const id_producto = parseInt(req.params.id_producto, 10);
  if (!id_producto) {
    res.status(400).json({ error: 'Invalid IDs' });
    return;
  }
  try {
    const supermercadoProducto = await SupermercadoProductoModel.getProductoAtSupermercado(id_producto);
    if (supermercadoProducto) {
      res.status(200).json(supermercadoProducto);
    } else {
      res.status(404).json({ error: `SupermercadoProducto with IDs (${id_producto}) not found` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSupermarketComparisonCards = async (req: Request, res: Response): Promise<void> => {
  try {
    const ids_products = typeof req.query.ids_products === 'string' ? req.query.ids_products : null;
    const supermarketComparisionCards = await SupermercadoProductoModel.getSupermarketComparisonCards(ids_products);
    res.status(200).json(supermarketComparisionCards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

export const getSaleProductsSupermarket = async (req: Request, res: Response): Promise<void> => {
  try {
    const ids_products = typeof req.query.ids_products === 'string' ? req.query.ids_products : null;
    const id_supermarket = typeof req.query.id_supermarket === 'string' ? req.query.id_supermarket : null;
    const saleProductsSupermarket = await SupermercadoProductoModel.getSaleProductsSupermarket(id_supermarket, ids_products);
    res.status(200).json(saleProductsSupermarket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

export const getNoDistributeProductsSupermarket = async (req: Request, res: Response): Promise<void> => {
  try {
    const ids_products = typeof req.query.ids_products === 'string' ? req.query.ids_products : null;
    const id_supermarket = typeof req.query.id_supermarket === 'string' ? req.query.id_supermarket : null;
    const noDistributeProductsSupermarket = await SupermercadoProductoModel.getNoDistributeProductsSupermarket(id_supermarket, ids_products);
    console.log(noDistributeProductsSupermarket)
    res.status(200).json(noDistributeProductsSupermarket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

export const getNoStockProductsSupermarket = async (req: Request, res: Response): Promise<void> => {
  try {
    const ids_products = typeof req.query.ids_products === 'string' ? req.query.ids_products : null;
    const id_supermarket = typeof req.query.id_supermarket === 'string' ? req.query.id_supermarket : null;
    const noStockProductsSupermarket = await SupermercadoProductoModel.getNoStockProductsSupermarket(id_supermarket, ids_products);
    res.status(200).json(noStockProductsSupermarket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

export const getAvailableProductsSupermarket = async (req: Request, res: Response): Promise<void> => {
  try {
    const ids_products = typeof req.query.ids_products === 'string' ? req.query.ids_products : null;
    const id_supermarket = typeof req.query.id_supermarket === 'string' ? req.query.id_supermarket : null;
    const availableProductsSupermarket = await SupermercadoProductoModel.getAvailableProductsSupermarket(id_supermarket, ids_products);
    console.log(availableProductsSupermarket)
    res.status(200).json(availableProductsSupermarket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}