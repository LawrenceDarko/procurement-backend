import { Request, Response } from 'express';
import ItemSubCategory from '../models/ItemSubCategory';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import Organization from '../models/Organization';

export const createItemSubCategory = async (req: Request, res: Response) => {
    const { name, description, categoryId, OrganizationId } = req.body;

    try {
        const itemSubCategory = await ItemSubCategory.create({
            name,
            description,
            category: categoryId,
            organization: OrganizationId
        });

        res.status(201).json(itemSubCategory);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getItemSubCategories = async (req: Request, res: Response) => {
    const { categoryId } = req.params
    try {
        const itemSubCategories = await ItemSubCategory.find({ category: categoryId }).populate('category');
        res.status(200).json(itemSubCategories);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getItemSubCategoriesBelongingToAnOrganization = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const itemSubCategories = await ItemSubCategory.find({ organization: req.user!.organization }).populate('category');
        res.status(200).json({success: true, data: itemSubCategories});
    } catch (error) {
        console.log("ERROR FETCHING ORGANIZATION SUB-CATEGORIES", error)
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateItemSubCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const itemSubCategory = await ItemSubCategory.findByIdAndUpdate(id, { name, description }, { new: true });

        if (!itemSubCategory) {
        return res.status(404).json({ message: 'Item sub-category not found' });
        }

        res.status(200).json(itemSubCategory);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteItemSubCategory = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const itemSubCategory = await ItemSubCategory.findByIdAndDelete(id);

        if (!itemSubCategory) {
        return res.status(404).json({ message: 'Item sub-category not found' });
        }

        res.status(200).json({ message: 'Item sub-category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
