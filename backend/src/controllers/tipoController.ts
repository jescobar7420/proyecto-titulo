import { Request, Response } from 'express';
import * as TipoModel from '../models/tipo';

export const getTipos = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || undefined;
    const tipos = await TipoModel.getTipos(limit);
    res.status(200).json(tipos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTipoById = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (!id) {
    res.status(400).json({ error: 'Invalid ID' });
    return;
  }
  try {
    const tipo = await TipoModel.getTipoById(id);
    if (tipo) {
      res.status(200).json(tipo);
    } else {
      res.status(404).json({ error: `Tipo with ID ${id} not found` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createTipo = async (req: Request, res: Response): Promise<void> => {
  const tipo = req.body.tipo;
  if (!tipo) {
    res.status(400).json({ error: 'Tipo name is required' });
    return;
  }
  try {
    const newTipo = await TipoModel.createTipo(tipo);
    res.status(201).json(newTipo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTipo = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const tipo = req.body.tipo;
  if (!id || !tipo) {
    res.status(400).json({ error: 'Invalid ID or Tipo name' });
    return;
  }
  try {
    const updatedTipo = await TipoModel.updateTipo(id, tipo);
    if (updatedTipo) {
      res.status(200).json(updatedTipo);
    } else {
      res.status(404).json({ error: `Tipo with ID ${id} not found` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTipoById = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (!id) {
    res.status(400).json({ error: 'Invalid ID' });
    return;
  }
  try {
    const deletedTipo = await TipoModel.deleteTipoById(id);
    if (deletedTipo) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: `Tipo with ID ${id} not found` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTypesByCategoryBrand = async (req: Request, res: Response): Promise<void> => {
  const id_category = typeof req.query.categories === 'string' ? req.query.categories : null;
  const id_marca = typeof req.query.brands === 'string' ? req.query.brands : null;
  try {
    const tipos = await TipoModel.getTypesByCategoryBrand(id_category, id_marca);
    res.status(200).json(tipos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTypesByBrands = async (req: Request, res: Response): Promise<void> => {
  try {
    const id_marcas = typeof req.query.brands === 'string' ? req.query.brands : null;
    
    const tipos = await TipoModel.getTypesByBrands(id_marcas);
    res.status(200).json(tipos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};