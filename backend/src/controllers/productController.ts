import { Request, Response } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../models/product';

export const getProductos = async (req: Request, res: Response): Promise<void> => {
  const { limit } = req.query;
  const products = await getProducts(limit ? parseInt(limit as string, 10) : undefined);
  res.json(products);
};

export const getProductoById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const product = await getProductById(parseInt(id, 10));
  res.json(product);
};

export const createProducto = async (req: Request, res: Response): Promise<void> => {
  const product = req.body;
  await createProduct(product);
  res.sendStatus(201);
};

export const updateProducto = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const product = req.body;
  await updateProduct(parseInt(id, 10), product);
  res.sendStatus(200);
};

export const deleteProducto = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await deleteProduct(parseInt(id, 10));
  res.sendStatus(204);
};