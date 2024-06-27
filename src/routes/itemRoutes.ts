import { Router } from 'express';
import { createItem, getItems, updateItem, deleteItem, createItemsInBulk } from '../controllers/itemController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect(['superadmin', 'admin']), createItem);
router.post('/bulk', protect(['superadmin', 'admin']), createItemsInBulk);
router.get('/', protect(['superadmin', 'admin', 'procurementofficer']), getItems);
router.patch('/:id', protect(['superadmin', 'admin']), updateItem);
router.delete('/:id', protect(['superadmin', 'admin']), deleteItem);

export default router;
