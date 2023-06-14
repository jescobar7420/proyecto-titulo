import { Router } from 'express';
import { insertQuotation, 
         getQuotationUser, 
         getProductsQuotation, 
         getListProductsQuotation,
         deleteQuotation
} from '../controllers/cotizacionController';

const router = Router();

router.get('/quotation-filter', getQuotationUser);
router.get('/quotation-products', getProductsQuotation);
router.get('/quotation-list-products', getListProductsQuotation);

router.post('/insert-quotation', insertQuotation);

router.delete('/delete-quotation', deleteQuotation)

export default router;

