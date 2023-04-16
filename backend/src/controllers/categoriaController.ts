import { Request, Response } from 'express';
import * as CategoriaModel from '../models/categoria';

export const getCategorias = async (req: Request, res: Response): Promise<void> => {
  try {
    const categorias = await CategoriaModel.getCategorias();
    res.status(200).json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCategoriaById = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (!id) {
    res.status(400).json({ error: 'Invalid ID' });
    return;
  }
  try {
    const categoria = await CategoriaModel.getCategoriaById(id);
    if (categoria) {
      res.status(200).json(categoria);
    } else {
      res.status(404).json({ error: `Categoria with ID ${id} not found` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createCategoria = async (req: Request, res: Response): Promise<void> => {
  const categoria = req.body.categoria;
  if (!categoria) {
    res.status(400).json({ error: 'Categoria name is required' });
    return;
  }
  try {
    const newCategoria = await CategoriaModel.createCategoria(categoria);
    res.status(201).json(newCategoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCategoria = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const categoria = req.body.categoria;
  if (!id || !categoria) {
    res.status(400).json({ error: 'Invalid ID or Categoria name' });
    return;
  }
  try {
    const updatedCategoria = await CategoriaModel.updateCategoria(id, categoria);
    if (updatedCategoria) {
      res.status(200).json(updatedCategoria);
    } else {
      res.status(404).json({ error: `Categoria with ID ${id} not found` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteCategoriaById = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (!id) {
    res.status(400).json({ error: 'Invalid ID' });
    return;
  }
  try {
    const deletedCategoria = await CategoriaModel.deleteCategoriaById(id);
    if (deletedCategoria) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: `Categoria with ID ${id} not found` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
