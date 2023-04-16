import { Router } from 'express';
import { 
    getCategorias, 
    getCategoriaById, 
    createCategoria, 
    updateCategoria, 
    deleteCategoriaById 
} from '../controllers/categoriaController';

const router = Router();

router.get('/categorias', getCategorias);
router.get('/categorias/:id', getCategoriaById);
router.post('/categorias', createCategoria);
router.put('/categorias/:id', updateCategoria);
router.delete('/categorias/:id', deleteCategoriaById);

export default router;
