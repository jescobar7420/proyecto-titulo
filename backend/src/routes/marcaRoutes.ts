import { Router } from 'express';
import { 
    getMarcas, 
    getMarcaById, 
    createMarca, 
    updateMarca, 
    deleteMarcaById,
    getBrandsByCategoryType,
    getBrandsByTypes
} from '../controllers/marcaController';

const router = Router();

router.get('/marcas', getMarcas);
router.get('/marcas/:id', getMarcaById);
router.get('/filter-brand', getBrandsByCategoryType);
router.get('/filter-brands-types', getBrandsByTypes);
router.post('/marcas', createMarca);
router.put('/marcas/:id', updateMarca);
router.delete('/marcas/:id', deleteMarcaById);

export default router;
