import { Request, Response } from 'express';
import ItemCategory from '../models/ItemCategory';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const createItemCategory = async (req: Request, res: Response) => {
    const { name, description, organizationId } = req.body;

    try {
        const itemCategory = await ItemCategory.create({
        name,
        description,
        organization: organizationId
        });

        res.status(201).json(itemCategory);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getItemCategories = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const itemCategories = await ItemCategory.find({ organization: req.user!.organization }).populate('organization');
        res.status(200).json(itemCategories);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateItemCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const itemCategory = await ItemCategory.findByIdAndUpdate(id, { name, description }, { new: true });

        if (!itemCategory) {
        return res.status(404).json({ message: 'Item category not found' });
        }

        res.status(200).json(itemCategory);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteItemCategory = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const itemCategory = await ItemCategory.findByIdAndDelete(id);

        if (!itemCategory) {
        return res.status(404).json({ message: 'Item category not found' });
        }

        res.status(200).json({ message: 'Item category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
