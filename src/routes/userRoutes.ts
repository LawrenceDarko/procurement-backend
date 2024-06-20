import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { getAllUsers, getAUser, deleteAUser, register } from '../controllers/userController';

const router = Router();

router.post('/register', register);
router.get('/', protect(['superadmin']), getAllUsers); // Only superadmins can view all users
router.get('/:id', protect(['superadmin']), getAUser); // Only superadmins can view a single user
router.delete('/:id', protect(['superadmin']), deleteAUser); // Only superadmins can delete users

export default router;
