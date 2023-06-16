import { Router } from 'express';
import { register, 
         login, 
         checkAuth, 
         recoverPassword, 
         verifyResetToken, 
         resetPassword } 
from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/recover-password', recoverPassword)
router.post('/verify-reset-token', verifyResetToken);
router.post('/reset-password', resetPassword);

router.get('/check-auth', checkAuth);

export default router;