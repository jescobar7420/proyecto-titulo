import { Router } from 'express';
import { getSupermercadosProductos, 
         getSupermercadoProductoByIds, 
         createSupermercadoProducto, 
         updateSupermercadoProducto,
         getProductoAtSupermercado
} from '../controllers/supermercadoProductoController';

const router = Router();

router.get('/supermercados-productos', getSupermercadosProductos);
router.get('/supermercados-productos/:id_supermercado/:id_producto', getSupermercadoProductoByIds);
router.get('/supermercados-productos/:id_producto', getProductoAtSupermercado);
router.post('/supermercados-productos', createSupermercadoProducto);
router.put('/supermercados-productos/:id_supermercado/:id_producto', updateSupermercadoProducto);

export default router;
