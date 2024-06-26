import { Request, Response } from 'express';
import Department from '../models/Department';
import SubDepartment from '../models/SubDepartment';
import User from '../models/User';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const createDepartment = async (req: Request, res: Response) => {
    const { name, organizationId } = req.body;

    try {
        const department = await Department.create({
            name,
            organization: organizationId,
        });

        res.status(201).json(department);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getDepartments = async (req: Request, res: Response) => {
    try {
        const departments = await Department.find().populate('organization');
        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAllDepartmentsBelongingToAnOrganization = async (req: Request, res: Response) => {
    const { organizationId } = req.params;

    try {
        const departments = await Department.find({ organization: organizationId }).populate('organization')
        res.status(200).json({ success: true, data: departments});
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' });
    }
}

export const updateDepartment = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const department = await Department.findByIdAndUpdate(id, { name }, { new: true });

        if (!department) {
        return res.status(404).json({ message: 'Department not found' });
        }

        res.status(200).json(department);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteDepartment = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    try {

        const isDepartmentHavingUsersUnderIt = await User.find({ organization: req.user!.organization, department: id });

        const isDepartementHavingSubDepartments = await SubDepartment.find({ department: id})
        if(isDepartementHavingSubDepartments.length > 0 || isDepartmentHavingUsersUnderIt.length > 0){
            return res.status(401).json({ message: "Not allowed. Department is having sub-department or Users"})
        }

        const department = await Department.findByIdAndDelete(id);

        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        res.status(200).json({ message: 'Department deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const createSubDepartment = async (req: Request, res: Response) => {
    const { name, departmentId } = req.body;

    try {
        const subDepartment = await SubDepartment.create({
        name,
        department: departmentId,
        });

        res.status(201).json(subDepartment);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getSubDepartments = async (req: Request, res: Response) => {
    // console.log("Hello world")
    try {
        const subDepartments = await SubDepartment.find().populate('department');
        res.status(200).json(subDepartments);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAllSubDepartmentsBelongingToADepartment = async (req: Request, res: Response) => {
    const { departmentId } = req.params;

    try {
        const subDepartments = await SubDepartment.find({ department: departmentId }).populate('department')
        res.status(200).json({ success: true, data: subDepartments});
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}


export const updateSubDepartment = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const subDepartment = await SubDepartment.findByIdAndUpdate(id, { name }, { new: true });

        if (!subDepartment) {
        return res.status(404).json({ message: 'Sub-department not found' });
        }

        res.status(200).json(subDepartment);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteSubDepartment = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;


    try {
        const isSubDepartmentHavingUsersUnderIt = await User.find({ organization: req.user!.organization, subDepartment: id });

        // const isSubDepartementHavingSubDepartments = await SubDepartment.find({ department: id})
        if(isSubDepartmentHavingUsersUnderIt.length > 0){
            return res.status(401).json({ message: "Not allowed. Sub-department is having Users"})
        }

        const subDepartment = await SubDepartment.findByIdAndDelete(id);

        if (!subDepartment) {
        return res.status(404).json({ message: 'Sub-department not found' });
        }

        res.status(200).json({ message: 'Sub-department deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
