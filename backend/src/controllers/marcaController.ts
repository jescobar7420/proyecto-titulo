import { Request, Response } from 'express';
import * as MarcaModel from '../models/marca';

export const getMarcas = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || undefined;
    const marcas = await MarcaModel.getMarcas(limit);
    res.status(200).json(marcas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMarcaById = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (!id) {
    res.status(400).json({ error: 'Invalid ID' });
    return;
  }
  try {
    const marca = await MarcaModel.getMarcaById(id);
    if (marca) {
      res.status(200).json(marca);
    } else {
      res.status(404).json({ error: `Marca with ID ${id} not found` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createMarca = async (req: Request, res: Response): Promise<void> => {
  const marca = req.body.marca;
  if (!marca) {
    res.status(400).json({ error: 'Marca name is required' });
    return;
  }
  try {
    const newMarca = await MarcaModel.createMarca(marca);
    res.status(201).json(newMarca);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateMarca = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const marca = req.body.marca;
  if (!id || !marca) {
    res.status(400).json({ error: 'Invalid ID or Marca name' });
    return;
  }
  try {
    const updatedMarca = await MarcaModel.updateMarca(id, marca);
    if (updatedMarca) {
      res.status(200).json(updatedMarca);
    } else {
      res.status(404).json({ error: `Marca with ID ${id} not found` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteMarcaById = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (!id) {
    res.status(400).json({ error: 'Invalid ID' });
    return;
  }
  try {
    const deletedMarca = await MarcaModel.deleteMarcaById(id);
    if (deletedMarca) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: `Marca with ID ${id} not found` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBrandsByCategoryType = async (req: Request, res: Response): Promise<void> => {
  const id_category = typeof req.query.categories === 'string' ? req.query.categories : null;
  const id_tipo = typeof req.query.types === 'string' ? req.query.types : null;

  try {
    const marcas = await MarcaModel.getBrandsByCategoryType(id_category, id_tipo);
    res.status(200).json(marcas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBrandsByTypes = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_tipos = typeof req.query.types === 'string' ? req.query.types : null;
    
    const marcas = await MarcaModel.getBrandsByTypes(id_tipos);
    res.status(200).json(marcas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};