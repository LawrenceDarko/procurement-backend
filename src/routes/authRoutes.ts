import { Router } from 'express';
import { registerOrganization, register, login, getAllUsers, getAUser, deleteAUser, logoutUser, updateUser } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import processImage from '../middleware/processImages';

const router = Router();

router.post('/register-organization', registerOrganization);
router.post('/register', processImage('image'), protect(['superadmin']), register);
router.post('/login', login);
router.get('/logout', protect(), logoutUser);

router.get('/users', protect(['superadmin', 'admin']), getAllUsers);
router.get('/users/:id', protect(['superadmin', 'admin']), getAUser);
router.patch('/users/:id', protect(['superadmin']), updateUser);
router.delete('/users/:id', protect(['superadmin', 'admin']), deleteAUser);

export default router;
