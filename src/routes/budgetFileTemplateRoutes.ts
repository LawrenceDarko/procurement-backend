import { Router } from 'express';
import { uploadBudgetFileTemplate, updateBudgetFileTemplate, deleteBudgetFileTemplate, upload, getAllBudgetFileTemplates } from '../controllers/budgetFileTemplateController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/', protect(['superadmin']), getAllBudgetFileTemplates);
router.post('/', protect(['superadmin']), upload.single('file'), uploadBudgetFileTemplate);
router.put('/:id', protect(['superadmin']), upload.single('file'), updateBudgetFileTemplate);
router.delete('/:id', protect(['superadmin']), deleteBudgetFileTemplate);

export default router;
