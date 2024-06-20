import { Router } from 'express';
import { createRole, getRoles, updateRole, deleteRole } from '../controllers/roleController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect(['superadmin']), createRole); // Only superadmins can create roles
router.get('/', protect(['superadmin']), getRoles); // Only superadmins can view all roles
router.patch('/:id', protect(['superadmin']), updateRole); // Only superadmins can update roles
router.delete('/:id', protect(['superadmin']), deleteRole); // Only superadmins can delete roles

export default router;
