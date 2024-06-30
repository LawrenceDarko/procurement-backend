import { Router } from 'express';
import { createBudget, getBudgets, getBudget, updateBudget, deleteBudget, createBudgetsInBulk, lockBudgetYear, unlockBudgetYear } from '../controllers/budgetController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect(['superadmin', 'admin', 'budgetowner']), createBudget);
router.post('/bulk', protect(['superadmin', 'admin']), createBudgetsInBulk);
router.get('/', protect(['superadmin', 'admin', 'budgetowner']), getBudgets);
router.get('/:id', protect(['superadmin', 'admin', 'budgetowner']), getBudget);
router.patch('/:id', protect(['superadmin', 'admin', 'budgetowner']), updateBudget);
router.delete('/:id', protect(['superadmin', 'admin']), deleteBudget);
router.patch('/lock/:year', protect(['superadmin', 'budgetowner']), lockBudgetYear);
router.patch('/unlock/:year', protect(['superadmin', 'budgetowner']), unlockBudgetYear);

export default router;
