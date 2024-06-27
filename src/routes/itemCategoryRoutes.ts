import { Router } from 'express';
import { createItemCategory, getItemCategories, updateItemCategory, deleteItemCategory } from '../controllers/itemCategoryController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect(['superadmin']), createItemCategory);
router.get('/', protect(['superadmin', 'admin']), getItemCategories);
router.patch('/:id', protect(['superadmin']), updateItemCategory);
router.delete('/:id', protect(['superadmin']), deleteItemCategory);

export default router;
