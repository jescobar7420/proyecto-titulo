import { Router } from 'express';
import { getProductos, getProductoById, createProducto, updateProducto, deleteProducto } from '../controllers/productController';

const router = Router();

router.get('/productos', getProductos);
router.get('/productos/:id', getProductoById);
router.post('/productos', createProducto);
router.put('/productos/:id', updateProducto);
router.delete('/productos/:id', deleteProducto);

export default router;