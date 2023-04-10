import { Request, Response } from 'express';
import { Marca } from '../models/marca';
import pool from '../database/pool';

export const getMarcas = async (req: Request, res: Response): Promise<Response> => {
  try {
    const response = await pool.query('SELECT * FROM marcas');
    return res.status(200).json(response.rows);
  } catch (error) {
    console.error('Error executing query', (error as Error).stack);
    return res.status(500).json('Internal server error');
  }
};

export const getMarcaById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = parseInt(req.params.id);
    const response = await pool.query('SELECT * FROM marcas WHERE id_marca = $1', [id]);
    if (response.rowCount === 0) {
      return res.status(404).json('Marca not found');
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error('Error executing query', (error as Error).stack);
    return res.status(500).json('Internal server error');
  }
};

export const createMarca = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { nombre } = req.body;
    const response = await pool.query('INSERT INTO marcas (marca) VALUES ($1) RETURNING *', [nombre]);
    return res.status(201).json(response.rows[0]);
  } catch (error) {
    console.error('Error executing query', (error as Error).stack);
    return res.status(500).json('Internal server error');
  }
};

export const updateMarca = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = parseInt(req.params.id);
    const { nombre } = req.body;
    const response = await pool.query('UPDATE marcas SET marca = $1 WHERE id_marca = $2 RETURNING *', [nombre, id]);
    if (response.rowCount === 0) {
      return res.status(404).json('Marca not found');
    }
    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error('Error executing query', (error as Error).stack);
    return res.status(500).json('Internal server error');
  }
};

export const deleteMarca = async (req: Request, res: Response): Promise<Response> => {
  try {
    const id = parseInt(req.params.id);
    const response = await pool.query('DELETE FROM marcas WHERE id_marca = $1', [id]);
    if (response.rowCount === 0) {
      return res.status(404).json('Marca not found');
    }
    return res.status(204).json();
  } catch (error) {
    console.error('Error executing query', (error as Error).stack);
    return res.status(500).json('Internal server error');
  }
};
