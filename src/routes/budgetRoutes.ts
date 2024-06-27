import { Router } from 'express';
import { createBudget, getBudgets, getBudget, updateBudget, deleteBudget } from '../controllers/budgetController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect(['superadmin', 'admin', 'budgetowner']), createBudget);
router.get('/', protect(['superadmin', 'admin', 'budgetowner']), getBudgets);
router.get('/:id', protect(['superadmin', 'admin', 'budgetowner']), getBudget);
router.patch('/:id', protect(['superadmin', 'admin', 'budgetowner']), updateBudget);
router.delete('/:id', protect(['superadmin', 'admin']), deleteBudget);

export default router;
