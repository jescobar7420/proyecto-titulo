import { Request, Response } from 'express';
import * as ProductoModel from '../models/product';
import { SupermarketComparisonCard } from '../interfaces/SupermarketComparisonCard';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string, 10) || undefined;
    const productos = await ProductoModel.getProducts(limit);
    res.status(200).json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  console.log(id)
  if (!id) {
    res.status(400).json({ error: 'Invalid ID' });
    return;
  }
  try {
    const producto = await ProductoModel.getProductById(id);
    if (producto) {
      res.status(200).json(producto);
    } else {
      res.status(404).json({ error: `Producto with ID ${id} not found` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  const producto = req.body.producto;
  if (!producto) {
    res.status(400).json({ error: 'Producto name is required' });
    return;
  }
  try {
    const newProducto = await ProductoModel.createProduct(producto);
    res.status(201).json(newProducto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const producto = req.body.producto;
  if (!id || !producto) {
    res.status(400).json({ error: 'Invalid ID or Producto name' });
    return;
  }
  try {
    const updatedProducto = await ProductoModel.updateProduct(id, producto);
    if (updatedProducto) {
      res.status(200).json(updatedProducto);
    } else {
      res.status(404).json({ error: `Producto with ID ${id} not found` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (!id) {
    res.status(400).json({ error: 'Invalid ID' });
    return;
  }
  try {
    await ProductoModel.deleteProduct(id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAvailableProductCards = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const productCards = await ProductoModel.getAvailableProductCards(limit);
    res.json(productCards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

export const getProductCardById = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (!id) {
    res.status(400).json({ error: 'Invalid ID' });
    return;
  }
  try {
    const producto = await ProductoModel.getProductCardById(id);
    if (producto) {
      res.status(200).json(producto);
    } else {
      res.status(404).json({ error: `Producto with ID ${id} not found` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const productsFilter = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters: Filters = req.body;
    const productCards = await ProductoModel.productsFilter(filters);
    res.json(productCards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getTotalResultFilter = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters: Filters = req.body;
    const productCards = await ProductoModel.getTotalResultFilter(filters);
    res.json(productCards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getSearchProductByName = async (req: Request, res: Response): Promise<void> => {
  try {
    const name = req.query.name as string;
    const productos = await ProductoModel.getSearchProductByName(name);
    res.status(200).json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProductCartById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_producto = Number(req.query.id_producto);
    const producto = await ProductoModel.getProductCartById(id_producto);
    res.status(200).json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProductCartByListId = async (req: Request, res: Response): Promise<void> => {
  try {
    const ids_producto = typeof req.query.ids_products === 'string' ? req.query.ids_products : null;
    const productos = await ProductoModel.getProductCartByListId(ids_producto);
    res.status(200).json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMostSoughtProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const productCards = await ProductoModel.getMostSoughtProducts();
    res.json(productCards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}