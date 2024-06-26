import { Request, Response } from 'express';
import Role from '../models/Role';
import Organization from '../models/Organization';

export const getOrganizationRoles = async (req: Request, res: Response) => {
    const { organizationId } = req.params;
    try {
        const departments = await Role.find({ organization: organizationId });
        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};