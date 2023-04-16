import { Router } from 'express';
import { getSupermercadosProductos, getSupermercadoProductoByIds, createSupermercadoProducto, updateSupermercadoProducto } from '../controllers/supermercado_productoController';

const router = Router();

router.get('/supermercados-productos', getSupermercadosProductos);
router.get('/supermercados-productos/:id_supermercado/:id_producto', getSupermercadoProductoByIds);
router.post('/supermercados-productos', createSupermercadoProducto);
router.put('/supermercados-productos/:id_supermercado/:id_producto', updateSupermercadoProducto);

export default router;
