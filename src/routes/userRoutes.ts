import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { login, logoutUser, getAllUsers, getAUser, deleteAUser, register } from '../controllers/userController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', protect(), logoutUser);

router.get('/users', protect(['admin']), getAllUsers); // Only admins can view all users
router.get('/users/:id', protect(['admin']), getAUser); // Only admins can view a single user
router.delete('/users/:id', protect(['admin']), deleteAUser); // Only admins can delete users

export default router;
