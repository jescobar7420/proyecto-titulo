import { Router } from 'express';
import { getProducts, 
         getProductById, 
         createProduct, 
         updateProduct, 
         deleteProduct,
         getAvailableProductCards,
         getProductCardById
} from '../controllers/productController';

const router = Router();

router.get('/productos', getProducts);
router.get('/productos/:id', getProductById);
router.get('/available-products', getAvailableProductCards);
router.get('/product-card/:id', getProductCardById);

router.post('/productos', createProduct);

router.put('/productos/:id', updateProduct);

router.delete('/productos/:id', deleteProduct);

export default router;