import { Router } from 'express';
import { getProducts, 
         getProductById, 
         createProduct, 
         updateProduct, 
         deleteProduct,
         getAvailableProductCards,
         getProductCardById,
         productsFilter,
         getTotalResultFilter,
         getSearchProductByName,
         getProductCartById,
         getProductCartByListId,
         getMostSoughtProducts
} from '../controllers/productController';

const router = Router();

router.get('/productos', getProducts);
router.get('/productos/:id', getProductById);
router.get('/available-products', getAvailableProductCards);
router.get('/product-card/:id', getProductCardById);
router.get('/search-product', getSearchProductByName);
router.get('/product-cart', getProductCartById);
router.get('/list-product-cart', getProductCartByListId);
router.get('/most-sought-products', getMostSoughtProducts);

router.post('/products-filter-result', getTotalResultFilter);
router.post('/productos', createProduct);
router.post('/products-filter', productsFilter)

router.put('/productos/:id', updateProduct);

router.delete('/productos/:id', deleteProduct);

export default router;