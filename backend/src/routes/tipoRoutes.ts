import { Router } from 'express';
import { getTipos, 
         getTipoById, 
         createTipo, 
         updateTipo, 
         deleteTipoById,
         getTypesByCategoryBrand,
         getTypesByBrands
} from '../controllers/tipoController';

const router = Router();

router.get('/tipos', getTipos);
router.get('/tipos/:id', getTipoById);
router.get('/filter-types', getTypesByCategoryBrand);
router.get('/filter-types-brands', getTypesByBrands);
router.post('/tipos', createTipo);
router.put('/tipos/:id', updateTipo);
router.delete('/tipos/:id', deleteTipoById);

export default router;
