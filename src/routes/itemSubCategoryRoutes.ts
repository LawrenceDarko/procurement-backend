import { Router } from 'express';
import { createItemSubCategory, getItemSubCategories, updateItemSubCategory, deleteItemSubCategory, getItemSubCategoriesBelongingToAnOrganization } from '../controllers/itemSubCategoryController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect(['superadmin']), createItemSubCategory);
router.get('/organization', protect(['superadmin', 'admin']), getItemSubCategoriesBelongingToAnOrganization);
router.get('/:categoryId', protect(['superadmin', 'admin']), getItemSubCategories);
router.put('/:id', protect(['superadmin']), updateItemSubCategory);
router.delete('/:id', protect(['superadmin']), deleteItemSubCategory);

export default router;
