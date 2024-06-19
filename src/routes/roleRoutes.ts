import { Router } from 'express';
import { createRole, getRoles, updateRole, deleteRole } from '../controllers/roleController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect(['admin']), createRole); // Only admins can create roles
router.get('/', protect(['admin']), getRoles); // Only admins can view all roles
router.put('/:id', protect(['admin']), updateRole); // Only admins can update roles
router.delete('/:id', protect(['admin']), deleteRole); // Only admins can delete roles

export default router;
