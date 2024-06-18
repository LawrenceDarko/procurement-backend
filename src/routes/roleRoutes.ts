import { Router } from 'express';
import { createRole, getRoles, assignRole } from '../controllers/roleController';

const router = Router();

router.post('/create', createRole);
router.get('/', getRoles);
router.post('/assign', assignRole);

export default router;
