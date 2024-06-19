import { Request, Response } from 'express';
import Role from '../models/Role';

export const createRole = async (req: Request, res: Response) => {
    const { title, description } = req.body;
    const name = title.toLowerCase().replace(/\s+/g, '');

    try {
        const existingRole = await Role.findOne({ name });

        if (existingRole) {
            return res.status(400).json({ message: 'Role already exists' });
        }

        const role = await Role.create({ title, name, description });

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

export const updateRole = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const role = await Role.findByIdAndUpdate(id, { name, description }, { new: true });

        if (!role) {
        return res.status(404).json({ message: 'Role not found' });
        }

        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteRole = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const role = await Role.findByIdAndDelete(id);

        if (!role) {
        return res.status(404).json({ message: 'Role not found' });
        }

        res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
