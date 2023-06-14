import { Router } from 'express';
import { getSupermercadosProductos, 
         getSupermercadoProductoByIds, 
         createSupermercadoProducto, 
         updateSupermercadoProducto,
         getProductoAtSupermercado,
         getSupermarketComparisonCards,
         getSaleProductsSupermarket,
         getNoDistributeProductsSupermarket,
         getNoStockProductsSupermarket,
         getAvailableProductsSupermarket,
         getProductsPricesAvailablesSupermarket,
         getPricesProductSupermarket
} from '../controllers/supermercadoProductoController';

const router = Router();

router.get('/supermercados-productos', getSupermercadosProductos);
router.get('/supermercados-productos/:id_supermercado/:id_producto', getSupermercadoProductoByIds);
router.get('/supermercados-productos/:id_producto', getProductoAtSupermercado);
router.get('/supermarket-comparison', getSupermarketComparisonCards);
router.get('/supermarket-sale', getSaleProductsSupermarket);
router.get('/supermarket-no-distribute', getNoDistributeProductsSupermarket);
router.get('/supermarket-no-stock', getNoStockProductsSupermarket);
router.get('/supermarket-available', getAvailableProductsSupermarket);
router.get('/supermarket-products-prices', getProductsPricesAvailablesSupermarket);
router.get('/supermarket-prices-product', getPricesProductSupermarket);

router.post('/supermercados-productos', createSupermercadoProducto);

router.put('/supermercados-productos/:id_supermercado/:id_producto', updateSupermercadoProducto);

export default router;
