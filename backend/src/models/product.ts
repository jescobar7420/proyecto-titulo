import { QueryResult } from 'pg';
import pool from '../database/pool';

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  marca: string;
  tipo: string;
}

export async function getProductos(limit: number): Promise<Producto[]> {
  const { rows } = await pool.query<Producto>('SELECT * FROM productos LIMIT $1', [limit]);
  return rows;
}

export async function getProductoById(id: number): Promise<Producto | null> {
  const { rows } = await pool.query<Producto>('SELECT * FROM productos WHERE id_producto = $1', [id]);
  return rows.length ? rows[0] : null;
}

export async function createProducto(producto: Producto): Promise<QueryResult> {
  const { nombre, descripcion, precio, categoria, marca, tipo } = producto;
  return pool.query(
    'INSERT INTO productos (nombre, descripcion, precio, categoria, marca, tipo) VALUES ($1, $2, $3, $4, $5, $6)',
    [nombre, descripcion, precio, categoria, marca, tipo]
  );
}

export async function updateProducto(id: number, producto: Producto): Promise<QueryResult> {
  const { nombre, descripcion, precio, categoria, marca, tipo } = producto;
  return pool.query(
    'UPDATE productos SET nombre = $2, descripcion = $3, precio = $4, categoria = $5, marca = $6, tipo = $7 WHERE id = $1',
    [id, nombre, descripcion, precio, categoria, marca, tipo]
  );
}

export async function deleteProducto(id: number): Promise<QueryResult> {
  return pool.query('DELETE FROM productos WHERE id = $1', [id]);
}