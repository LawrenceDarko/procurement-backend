import { Request, Response } from 'express';
import Role from '../models/Role';
import User from '../models/User';

export const createRole = async (req: Request, res: Response) => {
    const { name, permissions } = req.body;

    try {
        // Ensure AdministratorAccess includes 'all'
        if (permissions.AdministratorAccess && !permissions.AdministratorAccess.includes('all')) {
            permissions.AdministratorAccess.push('all');
        }

        const role = new Role({ name, permissions });
        await role.save();
        res.status(201).json(role);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getRoles = async (req: Request, res: Response) => {
    try {
        const roles = await Role.find();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const assignRole = async (req: Request, res: Response) => {
    const { userId, roleId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = roleId;
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
