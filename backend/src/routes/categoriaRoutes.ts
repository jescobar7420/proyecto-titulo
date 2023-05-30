import { Router } from 'express';
import { 
    getCategorias, 
    getCategoriaById, 
    getCategoriasMarcasTipos,
    createCategoria, 
    updateCategoria, 
    deleteCategoriaById 
} from '../controllers/categoriaController';

const router = Router();

router.get('/categorias', getCategorias);
router.get('/categoria/:id', getCategoriaById);
router.get('/categorias-marcas-tipos', getCategoriasMarcasTipos);
router.post('/categorias', createCategoria);
router.put('/categorias/:id', updateCategoria);
router.delete('/categorias/:id', deleteCategoriaById);

export default router;
