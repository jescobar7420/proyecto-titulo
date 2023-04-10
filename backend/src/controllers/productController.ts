import { Request, Response } from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: { rejectUnauthorized: false }
});

export const getProductos = async (req: Request, res: Response) => {
  try {
    const response = await pool.query('SELECT * FROM producto');
    res.status(200).json(response.rows);
  } catch (error) {
    console.error('Error executing query', (error as Error).stack);
    res.status(500).json({ message: 'Error executing query' });
  }
};

export const getProductoById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const response = await pool.query('SELECT * FROM producto WHERE id = $1', [id]);
    res.status(200).json(response.rows);
  } catch (error) {
    console.error('Error executing query', (error as Error).stack);
    res.status(500).json({ message: 'Error executing query' });
  }
};

export const createProducto = async (req: Request, res: Response) => {
  const { nombre, categoria, marca, tipo, precio } = req.body;
  try {
    const response = await pool.query('INSERT INTO producto (nombre, categoria, marca, tipo, precio) VALUES ($1, $2, $3, $4, $5) RETURNING id', [nombre, categoria, marca, tipo, precio]);
    res.status(200).json({ id: response.rows[0].id, message: 'Product added successfully!' });
  } catch (error) {
    console.error('Error executing query', (error as Error).stack);
    res.status(500).json({ message: 'Error executing query' });
  }
};

export const updateProducto = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { nombre, categoria, marca, tipo, precio } = req.body;
  try {
    const response = await pool.query('UPDATE producto SET nombre = $1, categoria = $2, marca = $3, tipo = $4, precio = $5 WHERE id = $6', [nombre, categoria, marca, tipo, precio, id]);
    res.status(200).json({ id: response.rows[0].id, message: 'Product updated successfully!' });
  } catch (error) {
    console.error('Error executing query', (error as Error).stack);
    res.status(500).json({ message: 'Error executing query' });
  }
};

export const deleteProducto = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const response = await pool.query('DELETE FROM producto WHERE id = $1', [id]);
    res.status(200).json({ id: response.rows[0].id, message: 'Product deleted successfully!' });
  } catch (error) {
    console.error('Error executing query', (error as Error).stack);
    res.status(500).json({ message: 'Error executing query' });
  }
};