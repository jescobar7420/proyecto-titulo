import { Router } from 'express';
import { insertQuotation } from '../controllers/cotizacionController';

const router = Router();

router.post('/insert-quotation', insertQuotation);

export default router;

