import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { login, logoutUser, getAllUsers, getAUser, deleteAUser, register } from '../controllers/userController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', protect(), logoutUser);

router.get('/users', protect(['superadmin']), getAllUsers); // Only superadmins can view all users
router.get('/users/:id', protect(['superadmin']), getAUser); // Only superadmins can view a single user
router.delete('/users/:id', protect(['superadmin']), deleteAUser); // Only superadmins can delete users

export default router;
