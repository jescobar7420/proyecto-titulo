import { Router } from 'express';
import { getSupermercados, getSupermercadoById, createSupermercado, updateSupermercado, deleteSupermercadoById } from '../controllers/supermercadoController';

const router = Router();

router.get('/supermercados', getSupermercados);
router.get('/supermercados/:id', getSupermercadoById);
router.post('/supermercados', createSupermercado);
router.put('/supermercados/:id', updateSupermercado);
router.delete('/supermercados/:id', deleteSupermercadoById);

export default router;
