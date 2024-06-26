import { Router } from 'express';
import { createDepartment, getDepartments, updateDepartment, deleteDepartment, createSubDepartment, getSubDepartments, updateSubDepartment, deleteSubDepartment, getAllDepartmentsBelongingToAnOrganization, getAllSubDepartmentsBelongingToADepartment } from '../controllers/departmentController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect(['superadmin']), createDepartment);
router.get('/', protect(['superadmin', 'admin']), getDepartments);
router.get('/:organizationId', protect(['superadmin', 'admin']), getAllDepartmentsBelongingToAnOrganization);
router.patch('/:id', protect(['superadmin']), updateDepartment);
router.delete('/:id', protect(['superadmin']), deleteDepartment);

router.post('/sub', protect(['superadmin']), createSubDepartment);
router.get('/sub', protect(['superadmin', 'admin']), getSubDepartments);
router.get('/sub/:departmentId', protect(['superadmin', 'admin']), getAllSubDepartmentsBelongingToADepartment);
router.patch('/sub/:id', protect(['superadmin']), updateSubDepartment);
router.delete('/sub/:id', protect(['superadmin']), deleteSubDepartment);

export default router;
