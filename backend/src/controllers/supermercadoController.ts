import { Request, Response } from 'express';
import * as SupermercadoModel from '../models/supermercado';

export const getSupermercados = async (req: Request, res: Response): Promise<void> => {
  try {
    const supermercados = await SupermercadoModel.getSupermercados();
    res.status(200).json(supermercados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSupermercadoById = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (!id) {
    res.status(400).json({ error: 'Invalid ID' });
    return;
  }
  try {
    const supermercado = await SupermercadoModel.getSupermercadoById(id);
    if (supermercado) {
      res.status(200).json(supermercado);
    } else {
      res.status(404).json({ error: `Supermercado with ID ${id} not found` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createSupermercado = async (req: Request, res: Response): Promise<void> => {
  const { supermercado, logo } = req.body;
  if (!supermercado || !logo) {
    res.status(400).json({ error: 'Supermercado name and logo are required' });
    return;
  }
  try {
    const newSupermercado = await SupermercadoModel.createSupermercado(supermercado, logo);
    res.status(201).json(newSupermercado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateSupermercado = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const { supermercado, logo } = req.body;
  if (!id || !supermercado || !logo) {
    res.status(400).json({ error: 'Invalid ID or Supermercado data' });
    return;
  }
  try {
    const updatedSupermercado = await SupermercadoModel.updateSupermercado(id, supermercado, logo);
    if (updatedSupermercado) {
      res.status(200).json(updatedSupermercado);
    } else {
      res.status(404).json({ error: `Supermercado with ID ${id} not found` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteSupermercadoById = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (!id) {
    res.status(400).json({ error: 'Invalid ID' });
    return;
  }
  try {
    const deletedSupermercado = await SupermercadoModel.deleteSupermercadoById(id);
    if (deletedSupermercado) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: `Supermercado with ID ${id} not found` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};